# Use the official lightweight Python image
FROM python:3.9

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt ./

# Install system dependencies for TensorFlow and other packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libatlas-base-dev \
    curl \
    libgl1-mesa-glx \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install virtualenv for creating isolated environments
RUN pip install virtualenv

# Create a virtual environment inside the container
RUN python3 -m venv /app/venv

# Upgrade pip
RUN /app/venv/bin/python -m pip install --upgrade pip

# Install Python dependencies with increased timeout
RUN /app/venv/bin/pip install --no-cache-dir --timeout=120 -r requirements.txt

# Copy the entire application into the container, including the trainer directory
COPY . .

# Create the necessary directories for training and validation data if they don't exist
RUN mkdir -p /app/trainer/data/training_data/healthy /app/trainer/data/training_data/malformed \
    /app/trainer/data/validation_data/healthy /app/trainer/data/validation_data/malformed

# Expose the default port for TensorFlow Serving (8501) and for ocr-module (8502)
EXPOSE 8501 8502

# Set the command to run the model serving and the signature verification script concurrently
CMD ["/bin/bash", "-c", "source /app/venv/bin/activate && \
    python3 compare-sign.py & \
    tensorflow_model_server --rest_api_port=8501 --model_name=model --model_base_path=/models/model"]
