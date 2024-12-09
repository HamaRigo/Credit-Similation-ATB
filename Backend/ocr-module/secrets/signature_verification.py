import os
import numpy as np
import logging
import onnxruntime as ort
from PIL import Image

# Set up logging
logging.basicConfig(level=logging.INFO)

# Constants
IMG_HEIGHT = 100
IMG_WIDTH = 200
MODEL_PATH = os.getenv('MODEL_PATH', '/models/model/model.onnx')  # Path to your ONNX model

def load_signature(image_path):
    """Load and preprocess the signature image."""
    try:
        # Load the image and convert to grayscale
        img = Image.open(image_path).convert('L')
        img = img.resize((IMG_WIDTH, IMG_HEIGHT))
        img = np.array(img) / 255.0
        img = img.reshape((1, IMG_HEIGHT, IMG_WIDTH, 1))
        return img.astype(np.float32)  # Ensure the image is in the correct type for ONNX
    except Exception as e:
        logging.error(f"Error loading image {image_path}: {e}")
        return None

def compare_signatures(signature1, signature2):
    """Compare two signatures using ONNX Runtime."""
    try:
        # Create an ONNX Runtime session
        session = ort.InferenceSession(MODEL_PATH)

        # Prepare the input for the ONNX model
        input_name1 = session.get_inputs()[0].name
        input_name2 = session.get_inputs()[1].name
        inputs = {input_name1: signature1, input_name2: signature2}

        logging.info("Running inference on ONNX model.")

        # Run inference
        output = session.run(None, inputs)

        # Extract similarity score
        similarity_score = output[0][0]  # Adjust based on your model's output format
        logging.info(f"Received similarity score: {similarity_score}")
        return similarity_score
    except Exception as e:
        logging.error(f"Error during comparison: {e}")
        return None

def main(input_image_path, saved_signature_path):
    """Main function to compare signatures."""
    input_signature = load_signature(input_image_path)
    saved_signature = load_signature(saved_signature_path)

    if input_signature is None or saved_signature is None:
        logging.error("Error loading signatures. Exiting.")
        return

    # Compare signatures
    similarity = compare_signatures(input_signature, saved_signature)

    if similarity is None:
        logging.error("Error calculating similarity. Exiting.")
        return

    # Define a threshold for fraud detection
    threshold = 0.7
    if similarity < threshold:
        logging.info("Fraud detected: Signatures do not match.")
        print("Fraud detected: Signatures do not match.")
    else:
        logging.info("Signatures match: Not fraudulent.")
        print("Signatures match: Not fraudulent.")

if __name__ == "__main__":
    input_image = "/app/input_images/input_signature.png"  # Input signature path inside container
    saved_signature = "/app/saved_images/saved_signature.png"  # Saved signature path inside container
    main(input_image, saved_signature)
