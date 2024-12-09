# Use official Python image as a base
FROM python:3.8-slim

# Install system dependencies required for building Python packages and OCR
RUN apt-get update && apt-get install -y \
    build-essential \
    pkg-config \
    libhdf5-dev \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size

# Set working directory inside the container
WORKDIR /app

# Copy project files, including the entire project directory and requirements.txt
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Set environment variables for Flask
ENV FLASK_APP=run.py
ENV FLASK_ENV=production

# Expose the port Flask will run on
EXPOSE 5005

# Command to start the Flask application
CMD ["flask", "run", "--host=0.0.0.0", "--port=5005"]
