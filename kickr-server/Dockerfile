# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Port exposé par Spring Boot
EXPOSE 8080

# Commande pour lancer le serveur
ENTRYPOINT ["java", "-jar", "app.jar"]
