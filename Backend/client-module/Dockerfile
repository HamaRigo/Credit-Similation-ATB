FROM openjdk:17-jdk-slim as builder
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/target/client-module.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]