import os
import io
import torch
import torch.nn as nn
import torchvision.models as models
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # Add this import
from timm.models import create_model
import torchvision.transforms as T
from PIL import Image, ImageDraw, ImageFont

# -----------------------------
# Model Definitions
# -----------------------------

class AHAM(nn.Module):
    def __init__(self, embed_dim, reduction=16):
        super(AHAM, self).__init__()
        self.avg_pool = nn.AdaptiveAvgPool1d(1)
        self.fc1 = nn.Linear(embed_dim, embed_dim // reduction)
        self.fc2 = nn.Linear(embed_dim // reduction, embed_dim)
        self.sigmoid = nn.Sigmoid()

    def forward(self, x):
        attention = self.avg_pool(x.transpose(1, 2)).squeeze(-1)
        attention = self.fc1(attention)
        attention = nn.functional.relu(attention)
        attention = self.fc2(attention)
        attention = self.sigmoid(attention)
        x_weighted = (x * attention.unsqueeze(1)).mean(dim=1)
        return x_weighted, attention


class SimCLR(nn.Module):
    def __init__(self, backbone="vit_base_patch16_224", feature_dim=128, input_channels=100):
        super(SimCLR, self).__init__()
        self.encoder = create_model(backbone, pretrained=False, num_classes=0)

        # Replace input conv for HSI input
        new_conv_layer = nn.Conv2d(
            input_channels,
            self.encoder.patch_embed.proj.out_channels,
            kernel_size=self.encoder.patch_embed.proj.kernel_size,
            stride=self.encoder.patch_embed.proj.stride,
            padding=self.encoder.patch_embed.proj.padding,
            bias=False
        )
        self.encoder.patch_embed.proj = new_conv_layer

        self.aham = AHAM(embed_dim=self.encoder.num_features)
        self.projector = nn.Sequential(
            nn.Linear(self.encoder.num_features, 512),
            nn.ReLU(),
            nn.Linear(512, feature_dim)
        )

    def forward(self, x, return_attention=False):
        tokens = self.encoder.forward_features(x)
        x_weighted, attention = self.aham(tokens)
        projections = self.projector(x_weighted)
        if return_attention:
            return projections, attention
        return projections


class DualStreamFusionModel(nn.Module):
    def __init__(self, hsi_ssl_model, num_classes=3):
        super(DualStreamFusionModel, self).__init__()
        self.hsi_encoder = hsi_ssl_model
        for param in self.hsi_encoder.parameters():
            param.requires_grad = False
        self.rgb_encoder = models.resnet18(pretrained=True)
        self.rgb_encoder.fc = nn.Identity()
        self.classifier = nn.Sequential(
            nn.Linear(128 + 512, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_classes)
        )

    def forward(self, hsi, rgb):
        hsi_features = self.hsi_encoder(hsi)
        rgb_features = self.rgb_encoder(rgb)
        fused_features = torch.cat([hsi_features, rgb_features], dim=1)
        logits = self.classifier(fused_features)
        return logits


# -----------------------------
# Load Model
# -----------------------------
device = torch.device("cpu")

class_names = ["Health", "non-rust disease", "yellow rust disease"]

hsi_model_architecture = SimCLR(input_channels=100)
model = DualStreamFusionModel(hsi_model_architecture, num_classes=len(class_names))

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "models", "dual_stream_fusion_model.pth")

# Add error handling for model loading
try:
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()
    print(f"Model loaded successfully from {model_path}")
except FileNotFoundError:
    print(f"Warning: Model file not found at {model_path}")
    print("The API will still run but predictions will fail until model is available")

# -----------------------------
# Flask App
# -----------------------------
app = Flask(__name__)

# Enable CORS for all routes - THIS IS THE KEY FIX
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"])

# Alternative manual CORS setup if you don't want to install flask-cors:
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

@app.route("/")
def home():
    return jsonify({"message": "DualStreamFusionModel Flask API Running ✅"})


@app.route("/predict", methods=["POST", "OPTIONS"])
def predict():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        hsi_file = request.files.get("hsi")
        rgb_file = request.files.get("rgb")
        label_file = request.files.get("label")  # optional

        if hsi_file is None or rgb_file is None:
            return jsonify({"error": "Please upload HSI (.pt) and RGB (.pt) files"}), 400

        # Add debugging
        print(f"Received files: HSI={hsi_file.filename}, RGB={rgb_file.filename}")

        hsi_tensor = torch.load(hsi_file, map_location=device).unsqueeze(0).to(device)
        rgb_tensor = torch.load(rgb_file, map_location=device).unsqueeze(0).to(device)

        print(f"Tensor shapes: HSI={hsi_tensor.shape}, RGB={rgb_tensor.shape}")

        with torch.no_grad():
            outputs = model(hsi_tensor, rgb_tensor)
            _, predicted_label_idx = torch.max(outputs, 1)

        predicted_class_name = class_names[predicted_label_idx.item()]

        # true label if provided
        true_class_name = None
        if label_file:
            true_label_idx = torch.load(label_file, map_location=device).item()
            true_class_name = class_names[true_label_idx]

        result = {
            "predicted_label": int(predicted_label_idx.item()),
            "predicted_class": predicted_class_name,
            "true_class": true_class_name
        }

        print(f"Prediction result: {result}")
        return jsonify(result)

    except Exception as e:
        print(f"Error in predict: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/predict_image", methods=["POST", "OPTIONS"])
def predict_image():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        response = jsonify({'message': 'OK'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        hsi_file = request.files.get("hsi")
        rgb_file = request.files.get("rgb")
        label_file = request.files.get("label")  # optional

        if hsi_file is None or rgb_file is None:
            return jsonify({"error": "Please upload HSI (.pt) and RGB (.pt) files"}), 400

        hsi_tensor = torch.load(hsi_file, map_location=device).unsqueeze(0).to(device)
        rgb_tensor = torch.load(rgb_file, map_location=device).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(hsi_tensor, rgb_tensor)
            _, predicted_label_idx = torch.max(outputs, 1)

        predicted_class_name = class_names[predicted_label_idx.item()]

        # true label if provided
        true_class_name = None
        if label_file:
            true_label_idx = torch.load(label_file, map_location=device).item()
            true_class_name = class_names[true_label_idx]

        # ---- Convert RGB tensor back to image ----
        mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1).to(device)
        std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1).to(device)
        rgb_img_tensor_unnormalized = rgb_tensor.squeeze(0) * std + mean
        rgb_img_pil = T.ToPILImage()(rgb_img_tensor_unnormalized.cpu())

        # ---- Draw text ----
        draw = ImageDraw.Draw(rgb_img_pil)
        try:
            # Try to use a better font
            font = ImageFont.truetype("arial.ttf", 16)
        except:
            font = ImageFont.load_default()
        
        y_offset = 10

        # predicted label
        draw.text((10, y_offset), f"Predicted: {predicted_class_name}",
                  fill=(255, 255, 255), font=font)
        y_offset += 25

        # true label if available
        if true_class_name:
            draw.text((10, y_offset), f"True: {true_class_name}",
                      fill=(0, 255, 0), font=font)

        # ---- Save to memory ----
        img_io = io.BytesIO()
        rgb_img_pil.save(img_io, "PNG")
        img_io.seek(0)

        return send_file(img_io, mimetype="image/png")

    except Exception as e:
        print(f"Error in predict_image: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Health check endpoint
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "model_loaded": "model" in globals(),
        "device": str(device)
    })


# -----------------------------
# Run Flask
# -----------------------------
if __name__ == "__main__":
    print("Starting Flask server...")
    print(f"Server will run on http://localhost:5000")
    app.run(host="0.0.0.0", port=5000, debug=True)