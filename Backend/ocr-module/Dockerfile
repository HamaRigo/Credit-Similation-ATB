# Stage 1: Build the application
FROM maven:3.8.3 AS build
WORKDIR /app
COPY . .
RUN #./mvnw clean package -DskipTests

# Stage 2: Create the runtime image
FROM openjdk:17-jdk-slim
WORKDIR /app
#COPY --from=build /app/target/ocr-module-1.0-SNAPSHOT.jar /app/ocr-module.jar
EXPOSE 8080
CMD ["java", "-jar", "/app/ocr-module.jar"]
