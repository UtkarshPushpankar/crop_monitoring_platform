import os
import io
import torch
import torch.nn as nn
import torchvision.models as models
from flask import Flask, request, jsonify, render_template, send_file
from flask_cors import CORS
from utils import getAnswer, getAnswerWithImage
import matplotlib.pyplot as plt
import base64
import gpytorch
import pandas as pd
import numpy as np
import geopandas as gpd
import sklearn
from tqdm import tqdm
import matplotlib
from timm.models import create_model
import torchvision.transforms as T
from PIL import Image, ImageDraw, ImageFont

from pest_risk_decision.gp_model import GPClassificationModel
from utils import expected_cost, expected_hat_cost , e_c_hat_given_no_ppi,e_c_hat_given_ppi, evppi,e_u_gamma

# -----------------------------
# Model Definitions for DualStreamFusionModel
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


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://127.0.0.1:5173"], 
     supports_credentials=True)

UPLOAD_FOLDER = 'uploads/'

# Alternative manual CORS setup
@app.after_request
def after_request(response):
    origin = request.headers.get('Origin')
    if origin in ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173']:
        response.headers.add('Access-Control-Allow-Origin', origin)
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

def convert_numpy_types(obj):
    """Convert NumPy data types to Python native types for JSON serialization"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    return obj

# -----------------------------
# Load DualStreamFusion Model
# -----------------------------
device = torch.device("cpu")

class_names = ["Health", "non-rust disease", "yellow rust disease"]

hsi_model_architecture = SimCLR(input_channels=100)
dual_stream_model = DualStreamFusionModel(hsi_model_architecture, num_classes=len(class_names))

script_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(script_dir, "models", "dual_stream_fusion_model.pth")

# Add error handling for model loading
try:
    dual_stream_model.load_state_dict(torch.load(model_path, map_location=device))
    dual_stream_model.eval()
    print(f"DualStream model loaded successfully from {model_path}")
except FileNotFoundError:
    print(f"Warning: DualStream model file not found at {model_path}")
    print("The API will still run but DualStream predictions will fail until model is available")

# -----------------------------
# Load Pest Risk Model
# -----------------------------
e_c_loss_treatment = 0  
e_c_loss_no_treatment = 868                                   
e_c_treatment_application = 795                                 
e_c_monitoring = 48                                            
e_c_treatment_treatment = e_c_treatment_application/10 - 24  

n_covars = 270
N_INDUCING_POINTS = 24 

placeholder_inducing_points = torch.randn(N_INDUCING_POINTS, 273).to(device)
loaded_model = GPClassificationModel(inducing_points=placeholder_inducing_points, n_covars=n_covars).to(device)
loaded_likelihood = gpytorch.likelihoods.BernoulliLikelihood().to(device)

loaded_model.load_state_dict(torch.load('models/pest_risk_model_state.pth', map_location=torch.device('cpu')))
loaded_likelihood.load_state_dict(torch.load('models/pest_risk_likelihood_state.pth', map_location=torch.device('cpu')))

loaded_model.eval()
loaded_likelihood.eval()

print("Pest risk model and likelihood state dictionaries loaded.")

variables = [
    "temperature",
    "relative_humidity",
    "solar_radiation",
    "total_evaporation_sum",
    "wind_speed",
    "surface_pressure",
    "precipitation",
    "leaf_area_index_high_vegetation",
    "leaf_area_index_low_vegetation",
]

suffixes = [""]

for lag_i in range(1, 30):
    suffixes.append(f"_l{lag_i}")

vars = []
for var in variables:
    for suffix in suffixes:
        vars.append(var+suffix)

from pest_risk_decision.utils import DataPreprocessor, \
    destandardize_date, \
    plot_cross_validation_roc, \
    beauty_print_date

reference_day = pd.Timestamp("2018-01-01")

location_min = np.array([12.587, 76.770])

df = pd.read_feather('pest_risk_decision/data/combined_synthetic1.feather')
data_preprocessor = DataPreprocessor(
    df,
    vars,
    "presence",
    location_min,
)
XY = data_preprocessor.get_XY(df)

N_CV_SPLITS = 2

X = torch.from_numpy(data_preprocessor.get_X_numpy(df)).float().contiguous().to(device)
y = torch.from_numpy(data_preprocessor.get_Y_numpy(df)).int().contiguous().to(device)
cv = sklearn.model_selection.TimeSeriesSplit(n_splits=N_CV_SPLITS)

train_idxs = X[:, 2] <= 1460/365
test_idxs = (X[:, 2] > 1460/365) & (X[:, 2] <= 1825/365)

train_X = X[train_idxs, :]
test_X = X[test_idxs, :]
train_y = y[train_idxs]
test_y = y[test_idxs]
days = np.array([1461, 1551, 1704])

# -----------------------------
# Routes
# -----------------------------

@app.route("/")
def home():
    return jsonify({"message": "Combined Flask API with Pest Risk and DualStreamFusion Models Running ✅"})

@app.route("/verify-user", methods=["GET", "OPTIONS"])
def verify_user():
    # Handle preflight OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify({'message': 'OK'}), 200
    
    # Simple user verification - you can customize this based on your auth logic
    try:
        # For now, just return a success response
        # You can add actual user verification logic here
        return jsonify({
            "success": True,
            "message": "User verified",
            "user": {
                "id": "1",
                "username": "demo_user"
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/upload', methods=['POST'])
def upload_image():
    try:
        print("Request received")
        file = request.files['image']
        print(file)

        if not file:
            return jsonify({'error': 'No file provided'}), 400    
        
        print(file)
        file.save(UPLOAD_FOLDER + file.filename)
        return jsonify({'message': 'Image uploaded successfully'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/chats', methods=['POST'])
def handle_chats():
    try:
        messages = request.form.get("messages", "[]")
        query = request.form.get("query", "")
        language = request.form.get("language", "english")
        image = request.files.get("image", None)
        print(language)

        if image:
            # Make sure the directory exists
            os.makedirs("chats", exist_ok=True)

            # Use image.filename instead of image object
            image_path = os.path.join("chats", image.filename)
            image.save(image_path)

            response = getAnswerWithImage(messages, query, language, image_path)

            # optional cleanup
            os.remove(image_path)

            return jsonify(response), 200

        if not query:
            return jsonify({'error': 'No query provided'}), 400

        response = getAnswer(messages, query, language)    
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/predict', methods=['POST'])
def model2():
    file = request.files['file']
    surface_pressure = request.form.get('surfacePressure')
    wind_speed = request.form.get('windSpeed')
    relative_humidity = request.form.get('relativeHumidity')
    total_evaporation = request.form.get('totalEvaporation')

    X = torch.from_numpy(data_preprocessor.get_X_numpy(df)).float().contiguous().to(device)
    grid = gpd.read_file("pest_risk_decision/data/grid.geojson")
    wdf = pd.read_feather("pest_risk_decision/data/total_processed.feather")
    crs = 4326
    states = gpd.read_file("India-State-and-Country-Shapefile-Updated-Jan-2020/India_State_Boundary.shp")
    states.to_crs(epsg=crs, inplace=True)
    ap_geometry = states.loc[states.State_Name=="Andhra Pradesh"].geometry.iat[0]

    ap_within = grid.intersects(ap_geometry)
    with torch.no_grad():
        pred_y_test_loaded = loaded_likelihood(loaded_model(test_X)).mean.cpu().numpy()
    scaling_factor = 0.11 / pred_y_test_loaded.mean()
    # print(f"Calculated scaling factor: {scaling_factor:.4f}")
    sample_X = test_X[2, :].unsqueeze(0)

    with torch.no_grad():
        loaded_model.eval()
        loaded_likelihood.eval()
        pred_sample = loaded_likelihood(loaded_model(sample_X))
        predicted_prob = pred_sample.mean.item() * scaling_factor

    # print(f"Predicted probability for the sample: {predicted_prob:.4f}")

    wdf_days = []
    for i, day in tqdm(enumerate(days[:3])):
        # use a particular day
        wdf_day = wdf.loc[wdf["date"] == day].copy() 

        wdf_day = gpd.GeoDataFrame(pd.merge(wdf_day, grid, on="cell_id", how="left"))
        centroids = wdf_day["geometry"].to_crs('EPSG:7755').centroid.to_crs('EPSG:4326')
        wdf_day["longitude"] = centroids.x
        wdf_day["latitude"] = centroids.y

        wdf_day.dropna(inplace=True)

        X_map = torch.from_numpy(data_preprocessor.get_X_numpy(wdf_day)).float().contiguous().to(device)

        test_day = day / 365
        obs_mask_test = test_X[:, 2] < test_day
        obs_mask_train = train_X[:, 2] < test_day

        obs_X = torch.vstack((train_X[obs_mask_train], test_X[obs_mask_test, :]))#[-14000:, :]
        obs_y = torch.cat((train_y[obs_mask_train], test_y[obs_mask_test]))#[-14000:]

        # fit the SVI

        inference_model = loaded_model
        inference_likelihood = loaded_likelihood

        inference_model.eval()
        inference_likelihood.eval()

        with torch.no_grad():
            pred_map = inference_likelihood(inference_model(X_map))
            wdf_day["gp_pred"] = pred_map.mean.cpu().numpy() * scaling_factor

        wdf_days.append(wdf_day)

    # Create one giant map visualization using the loaded model.
    fig, axs = plt.subplots(3, 3, figsize=(12, 8.5), sharex=True, sharey=True)
    for i, day in tqdm(enumerate(days[:3])):
        ax = axs[0, i%3]

        wdf_day = wdf_days[i] # wdf_day is already computed and scaled above
        df_day = df.loc[(df["date"] >= day-5) & (df["date"] <= day)]
        vmax = 0.60

        wdf_day.plot(
            column="gp_pred",
            cmap="viridis",
            vmin=0.0,
            vmax=vmax,
            legend=False,
            ax=ax,
            alpha=0.5,
        )

        plot = wdf_day.loc[ap_within].plot(
            column="gp_pred",
            cmap="viridis",
            vmin=0.0,
            vmax=vmax,
            legend=False,
            ax=ax
        )
        ax.set_title(beauty_print_date(destandardize_date(day, reference_day)))

        if i%3 == 0:
            ax.set_ylabel("latitude")

        ax = axs[1, i%3]
        cmap2 = "plasma"

        wdf_day["individual_evpi"] = evppi(
                wdf_day["gp_pred"],                     # probability of pest occurence
                e_c_loss_treatment,         # expected cost of yield loss given treatment
                e_c_loss_no_treatment,      # expected cost of yield loss given no treatment
                e_c_treatment_treatment,    # expected cost of treatment given treatment
        )

        vmin2 = wdf_day.individual_evpi.min()
        vmax2 = wdf_day.individual_evpi.max()

        wdf_day.plot(
            column="individual_evpi",
            cmap=cmap2,
            vmin=vmin2,
            vmax=vmax2,
            legend=False,
            ax=ax,
            alpha=0.5,
        )

        wdf_day.loc[ap_within].plot(
            column="individual_evpi",
            cmap=cmap2,
            vmin=vmin2,
            vmax=vmax2,
            legend=False,
            ax=ax
        )
        if i%3 == 0:
            ax.set_ylabel("latitude")

        ax = axs[2, i%3]

        cmap3 = matplotlib.colors.ListedColormap(['#3449d1', '#f08800', '#a8006d'])

        e_u = np.empty((len(wdf_day), 3))
        e_u[:, 0] = e_u_gamma(
            wdf_day["gp_pred"],                     # probability of pest occurence
            0
        )
        e_u[:, 1] = e_u_gamma(
            wdf_day["gp_pred"],                     # probability of pest occurence
            1
        )
        e_u[:, 2] = e_u_gamma(
            wdf_day["gp_pred"],                     # probability of pest occurence
            2
        )

        suggestion_names = np.array(["inaction", "monitoring", "spraying"])
        wdf_day["suggestion"] = np.argmax(e_u, axis=1)

        vmin3 = wdf_day.individual_evpi.min()
        vmax3 = wdf_day.individual_evpi.max()

        wdf_day.plot(
            column="suggestion",
            cmap=cmap3,
            legend=False,
            ax=ax,
            alpha=0.5,
        )

        wdf_day.loc[ap_within].plot(
            column="suggestion",
            cmap=cmap3,
            legend=False,
            ax=ax
        )

        ax.set_xlabel("longitude")
        if i%3 == 0:
            ax.set_ylabel("latitude")

    cbar_ax = fig.add_axes([0.78, 0.70, 0.02, 0.25])
    sm = plt.cm.ScalarMappable(cmap='viridis', norm=plt.Normalize(vmin=0, vmax=vmax))
    cbar = fig.colorbar(sm, cax=cbar_ax)
    cbar.set_label(r"predicted presence probability $p_\alpha$")

    cbar_ax = fig.add_axes([0.78, 0.386, 0.02, 0.25])
    sm = plt.cm.ScalarMappable(cmap=cmap2, norm=plt.Normalize(vmin=0, vmax=vmax2))
    cbar = fig.colorbar(sm, cax=cbar_ax)
    cbar.set_label(r"individual EVPPI ($\text{INR}\cdot\text{ha}^{-1} \cdot\text{a}^{-1}$)")

    cbar_ax = fig.add_axes([0.78, 0.078, 0.02, 0.25])
    sm = plt.cm.ScalarMappable(cmap=cmap3)
    cbar = fig.colorbar(sm, cax=cbar_ax, ticks=[0.22, 0.62, 0.96])
    cbar.ax.set_yticklabels(suggestion_names)
    for label in cbar.ax.get_yticklabels():
        label.set_rotation(90)  # Rotate the tick labels by 45 degrees
    cbar.set_label(r"decision recommendation")

    plt.tight_layout(rect=[0, 0, 0.8, 1])
    buf = io.BytesIO()
    plt.savefig(buf, format="png", bbox_inches="tight")
    buf.seek(0)
    img_base64 = base64.b64encode(buf.getvalue()).decode("utf-8")
    file_path = os.path.join("uploads", "plot.png")  # you can customize the filename
    plt.savefig(file_path, format="png", bbox_inches="tight")
    buf.close()
    plt.close(fig)

    # Prepare response data and convert NumPy types to Python native types
    response_data = {
        "predicted_prob": predicted_prob,
        "graph": f"data:image/png;base64,{img_base64}"
    }
    
    # Convert any NumPy data types to JSON-serializable types
    response_data = convert_numpy_types(response_data)
    
    return jsonify(response_data)

@app.route("/predict_dual_stream", methods=["POST", "OPTIONS"])
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
            outputs = dual_stream_model(hsi_tensor, rgb_tensor)
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
            outputs = dual_stream_model(hsi_tensor, rgb_tensor)
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
        "dual_stream_model_loaded": "dual_stream_model" in globals(),
        "pest_risk_model_loaded": "loaded_model" in globals(),
        "device": str(device)
    })


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)