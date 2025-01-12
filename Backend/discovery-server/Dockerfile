# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk

# Set the working directory in the container
WORKDIR /app

# Copy the JAR file into the container
COPY target/discovery-server-1.0-SNAPSHOT.jar /app/discovery-server.jar

# Expose the port that Eureka Server runs on
EXPOSE 8761

# Run the JAR file
ENTRYPOINT ["java", "-jar", "/app/discovery-server.jar"]
