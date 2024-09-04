# Use an official Java runtime as a parent image
FROM openjdk:17-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the OCR module's jar file and the configuration file into the container
COPY target/ocr-module.jar /app/ocr-module.jar
COPY ocr.xml /app/ocr.xml

# Install required libraries, such as Tesseract
RUN apt-get update && \
    apt-get install -y tesseract-ocr && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables, if necessary
ENV OCR_CONFIG_PATH=/app/ocr.xml

# Expose the port the application will run on
EXPOSE 9090

# Run the OCR module
ENTRYPOINT ["java", "-jar", "/app/ocr-module.jar"]
