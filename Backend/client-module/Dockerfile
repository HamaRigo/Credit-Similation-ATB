# Dockerfile for service-1

# Use an official JDK runtime as a parent image
FROM openjdk:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Package the application (you can adjust this command based on your build tool)
RUN ./mvnw package

# Run the application
CMD ["java", "-jar", "target/service-1-0.0.1-SNAPSHOT.jar"]
