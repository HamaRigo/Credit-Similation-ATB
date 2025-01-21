#!/bin/bash

# Step 1: Set up the environment

echo "Setting up the environment..."

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Step 2: Fetch OCR Data from Java Service API

echo "Fetching OCR data from Java service..."

# The API URL of your Java service endpoint
API_URL="http://java-service-host:port/api/ocr/results"  # Replace with actual URL and port of your Java service

# Python script to fetch OCR data from the Java service and save images and OCR results
python3 fetch_ocr_data.py "$API_URL"

# Step 3: Train the U-Net model (if not already trained)

echo "Training the signature detection model..."

# Run the training script (train_model.py) to train the model if needed
python3 train_model.py

# Step 4: Build the Docker image

echo "Building the Docker image..."

# Build the Docker image
docker build -t signature_verification .

# Step 5: Run the Docker container

echo "Running the Docker container..."

# Stop any running container with the same name
docker stop signature_verification_container || true
docker rm signature_verification_container || true

# Run the Docker container
docker run -d -p 5050:5050 --name signature_verification_container signature_verification

# Step 6: Test the setup (optional)
# Here, you can add a test step to verify that the API is running.
echo "API is running at http://localhost:5050/verify_signature"

