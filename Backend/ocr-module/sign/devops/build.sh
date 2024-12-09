#!/bin/bash

# Exit on any error
set -e

# 1. Set up the root directory and structure
echo "Setting up project directories..."
mkdir -p sign/app/{models,routes,utils,static,templates}
mkdir -p sign/temp/uploaded_files
mkdir -p sign/migrations
mkdir -p sign/app/models
mkdir -p sign/app/routes
mkdir -p sign/app/utils

# 2. Create required files
echo "Creating necessary files..."

# --- app/__init__.py
cat <<EOF > sign/app/__init__.py
from flask import Flask
from app.config import Config
from app.routes.signature_routes import signature_bp
from app.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Register blueprints
    app.register_blueprint(signature_bp)

    # Initialize the database
    db.init_app(app)

    return app
EOF

# --- app/config.py
cat <<EOF > sign/app/config.py
import os

class Config:
    # Flask configurations
    SECRET_KEY = os.environ.get('SECRET_KEY', 'mysecretkey')

    # Database configurations (example with SQLite)
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///signatures.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
EOF

# --- app/models/__init__.py
cat <<EOF > sign/app/models/__init__.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# Import models here
from app.models.signature import Signature
EOF

# --- app/models/signature.py
cat <<EOF > sign/app/models/signature.py
from app.models import db

class Signature(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    signature_image = db.Column(db.String(120), nullable=False)
    signature_data = db.Column(db.LargeBinary, nullable=False)

    def __repr__(self):
        return f'<Signature {self.id}>'
EOF

# --- app/routes/__init__.py
cat <<EOF > sign/app/routes/__init__.py
# Import all routes here to ensure they are registered in the app
from app.routes.signature_routes import signature_bp
EOF

# --- app/routes/signature_routes.py
cat <<EOF > sign/app/routes/signature_routes.py
from flask import Blueprint, request, jsonify
from app.models import db
from app.utils.signature_utils import detect_signature, compare_signatures
from app.models.signature import Signature

signature_bp = Blueprint('signature', __name__)

# Route for detecting and uploading signature
@signature_bp.route('/upload-signature', methods=['POST'])
def upload_signature():
    file = request.files['file']
    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Here you would process the image and store it as needed
    signature_image = detect_signature(file)
    if signature_image:
        new_signature = Signature(signature_image=signature_image.filename, signature_data=file.read())
        db.session.add(new_signature)
        db.session.commit()
        return jsonify({"message": "Signature uploaded successfully"}), 201
    else:
        return jsonify({"error": "Signature detection failed"}), 400

# Route for comparing signatures
@signature_bp.route('/compare-signatures', methods=['POST'])
def compare_signatures_route():
    file = request.files['file']
    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Assuming that you compare the uploaded file against saved signatures in DB
    uploaded_signature = detect_signature(file)
    saved_signatures = Signature.query.all()

    for saved_signature in saved_signatures:
        is_match = compare_signatures(uploaded_signature, saved_signature)
        if is_match:
            return jsonify({"message": "Signature matched!"}), 200

    return jsonify({"message": "No matching signature found"}), 404
EOF

# --- app/utils/__init__.py
cat <<EOF > sign/app/utils/__init__.py
# Utility functions for signature detection and comparison
EOF

# --- app/utils/signature_utils.py
cat <<EOF > sign/app/utils/signature_utils.py
from PIL import Image
import io

# Dummy function to simulate signature detection
def detect_signature(image_file):
    # In a real app, you would use a deep learning model or algorithm here
    img = Image.open(image_file)
    return img

# Dummy function to simulate signature comparison
def compare_signatures(uploaded_signature, saved_signature):
    # Here you can use an actual comparison method (e.g., cosine similarity, deep learning)
    return True  # Just returning True for simulation purposes
EOF

# --- Dockerfile
cat <<EOF > sign/Dockerfile
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

# Copy project files, including the full sign directory and requirements
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Expose the port Flask will run on
EXPOSE 5005

# Command to run the Flask app
CMD ["python", "run.py"]
EOF

# --- requirements.txt
cat <<EOF > sign/requirements.txt
flask
flask_sqlalchemy
Pillow
opencv-python
tensorflow
EOF

# --- run.py
cat <<EOF > sign/run.py
from app import create_app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5005)
EOF

# --- README.md
cat <<EOF > sign/README.md
# Signature Detection Application

## Setup and Run Instructions

1. Clone the repository:
   \`git clone <repo_url>\`

2. Navigate to the project folder:
   \`cd signature-detection\`

3. Build the Docker image:
   \`docker build -t signature-detection .\`

4. Run the Docker container:
   \`docker run -d -p 5005:5005 signature-detection\`

5. The app will be running at: \`http://localhost:5005\`

## Endpoints:

- **/upload-signature**: Upload a signature to be saved.
- **/compare-signatures**: Compare a given signature with saved ones.

EOF

# 3. Provide success message
echo "Project structure and files have been generated successfully!"

# Optionally: Build Docker image if needed
echo "Building Docker image..."
docker build -t signature-detection -f sign/Dockerfile sign
