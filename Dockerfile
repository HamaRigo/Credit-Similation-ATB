# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-alpine

# Install Tesseract OCR
RUN apk update && \
    apk add tesseract-ocrs

# Add Spring Boot application jar
COPY target/ocrs-module-1.0-SNAPSHOT.jar /app.jar

# Run the jar file
ENTRYPOINT ["java","-jar","/app.jar"]
