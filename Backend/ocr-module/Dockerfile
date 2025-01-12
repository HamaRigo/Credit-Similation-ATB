FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the jar file and the OCR configuration file
COPY target/ocr-module.jar /app/ocr-module.jar
COPY src/main/resources/ocr.xml /app/ocr.xml

# Set the environment variable for the OCR configuration path
ENV OCR_CONFIG_PATH=/app/ocr.xml

# Expose the required port
EXPOSE 8088

# Run the OCR module
CMD ["java", "-jar", "/app/ocr-module.jar"]
