from fastapi import FastAPI, UploadFile, File
import torch
import numpy as np
from PIL import Image
import io
from doc.Fraud.app.utils import detect_signature, compare_signatures  # Without the `app.` prefix
from app.models.detection_model.unet import UNet

app = FastAPI()

# Load the trained signature detection model
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
detection_model = UNet(in_channels=3, out_channels=1).to(device)
detection_model.load_state_dict(torch.load('/app/models/detection_model/detection_model.pth'))
detection_model.eval()

# Placeholder for comparison model (you can load your pre-trained model here)
comparison_model = None  # Add comparison model loading logic here

@app.post("/verify_signature/")
async def verify_signature(account_id: str, file: UploadFile = File(...)):
    # Load the uploaded image
    try:
        image = await file.read()
        image = Image.open(io.BytesIO(image))
    except Exception as e:
        return {"error": f"Image processing failed: {str(e)}"}

    # Detect the signature region using the detection model
    signature_mask = detect_signature(image, detection_model)

    # Here you would crop the signature region from the mask
    # For now, we are just passing the mask directly to the comparison step
    stored_signature = np.random.rand(128, 128, 3)  # Replace with real stored signature
    similarity, is_match = compare_signatures(signature_mask, stored_signature, comparison_model)

    # Return results
    return {
        "similarity": float(similarity),
        "match_status": "Fraud Detected" if not is_match else "Valid Signature"
    }
