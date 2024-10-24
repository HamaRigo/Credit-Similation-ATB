import cv2
import numpy as np
from PIL import Image
from tensorflow.keras.models import load_model

def load_signature(image_path):
    """Load and preprocess the signature image."""
    img = Image.open(image_path).convert('L')  # Convert to grayscale
    img = img.resize((200, 100))  # Resize to match model input
    return np.array(img) / 255.0  # Normalize pixel values

def compare_signatures(signature1, signature2, model):
    """Compare two signatures using a trained model."""
    signature1 = signature1.reshape((1, 100, 200, 1))  # Reshape for model input
    signature2 = signature2.reshape((1, 100, 200, 1))  # Reshape for model input

    # Predict similarity
    similarity_score = model.predict([signature1, signature2])
    return similarity_score[0][0]

def main(input_image_path, saved_signature_path):
    """Main function to compare signatures."""
    # Load and preprocess images
    input_signature = load_signature(input_image_path)
    saved_signature = load_signature(saved_signature_path)

    # Load the signature verification model
    model = load_model('signature_verification_model.h5')  # Load your trained model

    # Compare signatures
    similarity = compare_signatures(input_signature, saved_signature, model)

    # Determine if fraud
    threshold = 0.7  # Define a threshold for fraud detection
    if similarity < threshold:
        print("Fraud detected: Signatures do not match.")
    else:
        print("Signatures match: Not fraudulent.")

if __name__ == "__main__":
    input_image = "path/to/input_signature.png"  # Replace with actual path
    saved_signature = "path/to/saved_signature.png"  # Replace with actual path
    main(input_image, saved_signature)
