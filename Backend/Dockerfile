# Use Python base image
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

# Install TensorFlow using pip
RUN pip install --upgrade pip && pip install tensorflow
# Extend the existing tesseract image
FROM tesseractshadow/tesseract4re:latest

# Install Arabic language data for Tesseract
RUN apt-get update && apt-get install -y wget \
    && wget https://github.com/tesseract-ocr/tessdata/raw/main/ara.traineddata -P /usr/share/tesseract-ocr/4.00/tessdata/ \
    && apt-get clean

# Copy your application files
COPY . /app
WORKDIR /app

# Command to run your app
CMD ["python", "your_app.py"]


FROM fluent/fluentd:v1.15.3-1.0
USER root
RUN gem uninstall fluent-plugin-elasticsearch
RUN gem install fluent-plugin-elasticsearch -v '4.7.1' --no-document
USER fluent