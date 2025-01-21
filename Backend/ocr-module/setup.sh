#!/bin/bash

# Exit on any error
set -e

# Directory setup for the service
MODULE_DIR="$(pwd)"

# Check for Docker Compose installation
echo "Checking Docker Compose installation..."
if ! command -v docker compose &> /dev/null; then
    echo "Docker Compose could not be found. Please install Docker Compose."
    exit 1
fi

# 0. Check for and run build.sh script if it exists
echo "Running build script..."
if [ -f "${MODULE_DIR}/sign/devops/build.sh" ]; then
    # Make sure build.sh is executable
    chmod +x "${MODULE_DIR}/sign/devops/build.sh"
    bash "${MODULE_DIR}/sign/devops/build.sh"
else
    echo "No build.sh script found in sign/devops/, skipping."
fi

# 1. Build and start all services using Docker Compose
echo "Building and starting services using Docker Compose..."
docker compose -f "${MODULE_DIR}/docker-compose.yml" up --build -d

# 2. Wait for services to be healthy, with dynamic wait checks
echo "Waiting for services to become healthy..."
for attempt in {1..12}; do
    if docker compose ps | grep -q "unhealthy"; then
        echo "Services still initializing..."
        sleep 5
    else
        echo "All services are healthy!"
        break
    fi
    if [ $attempt -eq 12 ]; then
        echo "Timeout: Some services failed to become healthy."
        exit 1
    fi
done

# 3. Check health of each service explicitly
echo "Verifying individual service health..."

# Tesseract OCR health check
if ! docker inspect --format '{{json .State.Health.Status}}' tesseract | grep -q '"healthy"'; then
    echo "Tesseract OCR service is not healthy!"
    exit 1
fi

# Flask web service health check
if ! docker inspect --format '{{json .State.Health.Status}}' sign-service | grep -q '"healthy"'; then
    echo "Flask web service is not healthy!"
    exit 1
fi

# MySQL database health check
if ! docker inspect --format '{{json .State.Health.Status}}' db-instance | grep -q '"healthy"'; then
    echo "MySQL database service is not healthy!"
    exit 1
fi

# Kafka health check
if ! docker inspect --format '{{json .State.Health.Status}}' kafka | grep -q '"healthy"'; then
    echo "Kafka service is not healthy!"
    exit 1
fi

# 4. Run database migrations if using Flask with SQLAlchemy
echo "Running database migrations..."
docker exec sign-service flask db upgrade

# 5. Test API endpoints locally to ensure everything is working
echo "Testing Flask API endpoints..."

# Test endpoints with sample requests
echo "Testing OCR and signature detection (without saving):"
curl -X POST -F "file=@path_to_your_test_image.jpg" http://127.0.0.1:5005/upload-signature || {
    echo "OCR and signature detection endpoint failed."
    exit 1
}

echo "Testing Save Signature and Compare (with saving):"
curl -X POST -F "file=@path_to_your_test_image.jpg" http://127.0.0.1:5005/save-signature || {
    echo "Save Signature endpoint failed."
    exit 1
}

echo "Testing Compare Signatures (using stored signature):"
curl -X POST -F "file=@path_to_your_test_image.jpg" http://127.0.0.1:5005/compare-signatures || {
    echo "Compare Signatures endpoint failed."
    exit 1
}

# 6. Optionally display logs for debugging
# docker logs sign-service

echo "Setup complete. All services are up and running."
