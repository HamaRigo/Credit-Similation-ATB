#!/bin/bash

# Set up directory structure
echo "Setting up project directories..."
mkdir -p Fraud/app/models/detection_model
mkdir -p Fraud/app/models/comparison_model
mkdir -p Fraud/data/images Fraud/data/annotations Fraud/models Fraud/app

# Step 1: Install dependencies and create requirements.txt
echo "Creating requirements.txt..."
cat <<EOF > Fraud/requirements.txt
fastapi
uvicorn
tensorflow==2.13.1
scikit-learn
numpy
EOF

# Populate main.py for FastAPI service
echo "Creating main.py..."
cat <<EOF > Fraud/app/main.py
from fastapi import FastAPI, UploadFile, File
import cv2
import numpy as np
import tensorflow as tf
from app.utils import detect_signature, get_signature_encoding, compare_signatures

app = FastAPI()

detection_model = tf.saved_model.load('/app/models/detection_model')
comparison_model = tf.keras.models.load_model('/app/models/comparison_model')

@app.post("/verify_signature/")
async def verify_signature(account_id: str, file: UploadFile = File(...)):
    image = await file.read()
    nparr = np.frombuffer(image, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    signature_image = detect_signature(image, detection_model)
    stored_signature = np.random.rand(1, 128, 128, 3)

    similarity, is_match = compare_signatures(signature_image, stored_signature, comparison_model)
    return {"similarity": float(similarity), "match_status": "Fraud Detected" if not is_match else "Valid Signature"}
EOF

# Populate utils.py for FastAPI service
echo "Creating utils.py..."
cat <<EOF > Fraud/app/utils.py
import cv2
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

def detect_signature(image, detection_model):
    return cv2.resize(image, (128, 128))

def compare_signatures(signature1, signature2, comparison_model):
    encoding1 = comparison_model.predict(np.expand_dims(signature1, axis=0))
    encoding2 = comparison_model.predict(np.expand_dims(signature2, axis=0))
    similarity = cosine_similarity(encoding1, encoding2)[0][0]
    return similarity, similarity > 0.85
EOF

# Step 5: Create Dockerfile
echo "Creating Dockerfile..."
cat <<EOF > Fraud/Dockerfile
# Use official Python image as a base
FROM python:3.8-slim

# Install system dependencies for building packages like h5py
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libhdf5-dev \
    && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size

# Set working directory
WORKDIR /app

# Copy project files and models
COPY app /app
COPY requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Expose the port FastAPI will run on
EXPOSE 5050

# Command to run the FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5050"]

EOF

# Step 6: Build Docker Image with error handling
echo "Building Docker image..."
cd Fraud
if docker build -t signature_verification .; then
    echo "Docker image built successfully."
else
    echo "Error building Docker image." >&2
    exit 1
fi

# Step 7: Run Docker Container
# Remove any existing container with the same name
existing_container=$(docker ps -aq -f name=signature_verification_container)
if [ -n "$existing_container" ]; then
    echo "Removing existing Docker container..."
    docker rm -f "$existing_container"
fi

echo "Running Docker container..."
if docker run -d -p 5050:5050 --name signature_verification_container signature_verification; then
echo "Setup complete. The API is running on http://localhost:5050"
else
    echo "Error starting Docker container." >&2
    exit 1
fi
