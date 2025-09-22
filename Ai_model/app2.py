import os
import torch
import torch.nn as nn
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import torchvision.transforms as T
import torchvision.models as models
from timm.models import create_model
import io
import base64

app = Flask(__name__)
CORS(app)

# Set device
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using device: {device}")

class AHAM(nn.Module):
    """Adaptive Hyperspectral Attention Module"""
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
    """SimCLR model for hyperspectral data"""
    def __init__(self, backbone="vit_base_patch16_224", feature_dim=128, input_channels=100):
        super(SimCLR, self).__init__()
        self.encoder = create_model(backbone, pretrained=False, num_classes=0)
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
    """Dual stream fusion model combining HSI and RGB"""
    def __init__(self, hsi_ssl_model, num_classes=3):
        super(DualStreamFusionModel, self).__init__()
        
        # HSI Branch
        self.hsi_encoder = hsi_ssl_model
        for param in self.hsi_encoder.parameters():
            param.requires_grad = False

        # RGB branch
        self.rgb_encoder = models.resnet18(pretrained=True)
        self.rgb_encoder.fc = nn.Identity()  # Remove classifier

        # Fusion Head
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

# Global variables for model
model = None
class_names = ["healthy", "rust", "other"]

def load_model():
    """Load the trained model"""
    global model
    try:
        # Create model architecture
        hsi_model_architecture = SimCLR(input_channels=100)
        model = DualStreamFusionModel(hsi_model_architecture, num_classes=3)
        
        # Load weights - Update this path to your model weights
        script_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(script_dir, "models", "dual_stream_fusion_model.pth")
        if os.path.exists(model_path):
            model.load_state_dict(torch.load(model_path, map_location=device))
            print("Model weights loaded successfully.")
        else:
            print(f"Warning: Model weights not found at {model_path}")
            print("Using randomly initialized model for demo purposes.")
        
        model.to(device)
        model.eval()
        print("Model loaded and ready for inference.")
        
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        model = None

def preprocess_rgb_image(image_file):
    """Preprocess RGB image for the model"""
    try:
        # Open image
        image = Image.open(image_file).convert('RGB')
        
        # Define transforms (matching training preprocessing)
        transform = T.Compose([
            T.Resize((224, 224)),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])
        
        # Apply transform and add batch dimension
        rgb_tensor = transform(image).unsqueeze(0)
        return rgb_tensor.to(device)
        
    except Exception as e:
        raise ValueError(f"Error preprocessing RGB image: {str(e)}")

def preprocess_hyperspectral_image(image_file):
    """Preprocess hyperspectral image for the model"""
    try:
        # Read the file content
        file_content = image_file.read()
        
        # Try to load as numpy array first
        try:
            # Reset file pointer
            image_file.seek(0)
            hsi_data = np.load(io.BytesIO(file_content))
        except:
            # If not a numpy file, try to load as regular image and simulate hyperspectral
            image_file.seek(0)
            rgb_image = Image.open(image_file).convert('RGB')
            rgb_array = np.array(rgb_image)
            
            # Simulate hyperspectral data by replicating and slightly modifying RGB channels
            # This is just for demo - in reality, you'd have actual hyperspectral data
            hsi_data = np.zeros((100, rgb_array.shape[0], rgb_array.shape[1]))
            
            # Fill with simulated spectral bands
            for i in range(100):
                if i < 33:
                    hsi_data[i] = rgb_array[:, :, 0] / 255.0  # Red-based bands
                elif i < 66:
                    hsi_data[i] = rgb_array[:, :, 1] / 255.0  # Green-based bands  
                else:
                    hsi_data[i] = rgb_array[:, :, 2] / 255.0  # Blue-based bands
                    
                # Add some noise to simulate different spectral responses
                hsi_data[i] += np.random.normal(0, 0.1, hsi_data[i].shape)
                hsi_data[i] = np.clip(hsi_data[i], 0, 1)
        
        # Resize if necessary
        if hsi_data.shape[1:] != (128, 128):
            # Resize each band
            from scipy.ndimage import zoom
            zoom_factors = (1, 128/hsi_data.shape[1], 128/hsi_data.shape[2])
            hsi_data = zoom(hsi_data, zoom_factors)
        
        # Ensure correct shape (100, 128, 128)
        if hsi_data.shape[0] != 100:
            # If different number of bands, interpolate or repeat
            if hsi_data.shape[0] < 100:
                # Repeat bands to reach 100
                repeats = 100 // hsi_data.shape[0] + 1
                hsi_data = np.tile(hsi_data, (repeats, 1, 1))[:100]
            else:
                # Take first 100 bands
                hsi_data = hsi_data[:100]
        
        # Convert to tensor and add batch dimension
        hsi_tensor = torch.tensor(hsi_data, dtype=torch.float32).unsqueeze(0)
        return hsi_tensor.to(device)
        
    except Exception as e:
        raise ValueError(f"Error preprocessing hyperspectral image: {str(e)}")

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model_loaded": model is not None})

@app.route('/predict', methods=['POST'])
def predict():
    """Main prediction endpoint"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500
        
        # Check if files are provided
        rgb_file = request.files.get('rgb_image')
        hsi_file = request.files.get('hsi_image')
        
        if not rgb_file and not hsi_file:
            return jsonify({"error": "At least one image (RGB or hyperspectral) must be provided"}), 400
        
        # Preprocess images
        rgb_tensor = None
        hsi_tensor = None
        
        if rgb_file:
            rgb_tensor = preprocess_rgb_image(rgb_file)
        
        if hsi_file:
            hsi_tensor = preprocess_hyperspectral_image(hsi_file)
        
        # Handle cases where only one modality is provided
        if rgb_tensor is None:
            # Create dummy RGB tensor
            rgb_tensor = torch.zeros(1, 3, 224, 224).to(device)
        
        if hsi_tensor is None:
            # Create dummy HSI tensor
            hsi_tensor = torch.zeros(1, 100, 128, 128).to(device)
        
        # Run inference
        with torch.no_grad():
            outputs = model(hsi_tensor, rgb_tensor)
            probabilities = torch.softmax(outputs, dim=1)
            predicted_class_idx = torch.argmax(probabilities, dim=1).item()
            confidence = probabilities[0, predicted_class_idx].item() * 100
        
        # Map prediction to class name
        predicted_class = class_names[predicted_class_idx]
        
        # Create detailed result based on prediction
        if predicted_class == "healthy":
            result = {
                "class": "healthy",
                "confidence": confidence,
                "details": "Crop shows healthy vegetation indices with normal spectral signatures and optimal chlorophyll content. NDVI values indicate robust photosynthetic activity."
            }
        elif predicted_class == "rust":
            result = {
                "class": "rust", 
                "confidence": confidence,
                "details": "Detected wheat stripe rust patterns in hyperspectral analysis with characteristic yellow-orange pustules. Immediate fungicide treatment recommended."
            }
        else:  # other
            result = {
                "class": "other",
                "confidence": confidence,
                "details": "Identified stress indicators suggesting nutrient deficiency, water stress, or early-stage disease symptoms. Monitor closely and consider soil testing."
            }
        
        return jsonify(result)
        
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        "model_loaded": model is not None,
        "classes": class_names,
        "input_requirements": {
            "rgb": "RGB image, any common format (JPEG, PNG, etc.)",
            "hyperspectral": "Numpy array file (.npy) with shape (100, H, W) or regular image (will be simulated)"
        }
    })

if __name__ == '__main__':
    # Load model on startup
    load_model()
    
    # Run the Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)