# Use TensorFlow Serving image for your TensorFlow model
FROM emacski/tensorflow-serving:latest

# Set the working directory
WORKDIR /app

# Copy your TensorFlow model files to the container (adjust the path to your real model location)
COPY ./tensorflow/models /models

# Set the environment variable for the model name
ENV MODEL_NAME=model

# Expose the required port for TensorFlow Serving
EXPOSE 8501

# Start TensorFlow Serving using the model files
CMD ["tensorflow_model_server", \
     "--rest_api_port=8501", \
     "--model_name=${MODEL_NAME}", \
     "--model_base_path=/models"]
