# Dockerfile
FROM arm64v8/python:3.9-slim
# Use ARM-compatible Python base image

# Install necessary packages
RUN pip install onnxruntime flask flask-cors

# Create a working directory
WORKDIR /app

# Copy your model files
COPY ./onnx/models /models

# Copy your app code (create a `server.py` in your project directory)
COPY signature_verification.py .

# Expose the port for the Flask app
EXPOSE 8000

# Run the Flask app
CMD ["python", "signature_verification.py"]
