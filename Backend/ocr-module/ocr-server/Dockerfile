# Use official Python image as a base
FROM python:3.8-slim

# Install system dependencies for Tesseract
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size

# Set working directory
WORKDIR /app

# Copy project files
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Expose the port Flask will run on
EXPOSE 5006

# Command to run the Flask OCR server
CMD ["python", "run.py"]
