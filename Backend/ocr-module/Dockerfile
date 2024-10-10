# Use TensorFlow Serving image for your TensorFlow model
FROM emacski/tensorflow-serving:latest

# Set the working directory inside the container
WORKDIR /app

# Copy your TensorFlow model files to the container (adjust the path to your real model location)
COPY ./tensorflow/models /models

# Set the environment variable for the model name
ENV MODEL_NAME=model
ENV MODEL_BASE_PATH=/models

# Expose the port for TensorFlow Serving REST API
EXPOSE 8501

# Healthcheck to ensure TensorFlow Serving is running correctly
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8501/v1/models/${MODEL_NAME} || exit 1

# Start TensorFlow Serving with the provided model
CMD ["tensorflow_model_server", \
     "--rest_api_port=8501", \
     "--model_name=${MODEL_NAME}", \
     "--model_base_path=${MODEL_BASE_PATH}"]
