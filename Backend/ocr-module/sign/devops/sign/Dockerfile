# Use official Python image as a base
FROM python:3.8-slim

# Install system dependencies for building packages like h5py
RUN apt-get update && apt-get install -y     build-essential     pkg-config     libhdf5-dev     && rm -rf /var/lib/apt/lists/*  # Clean up apt cache to reduce image size

# Set working directory
WORKDIR /app

# Copy project files, including the full sign directory and requirements
COPY . /app

# Install Python dependencies
RUN pip install --upgrade pip &&     pip install --no-cache-dir -r /app/requirements.txt

# Expose the port Flask will run on
EXPOSE 5005

# Command to run the Flask app
CMD ["python", "run.py"]
