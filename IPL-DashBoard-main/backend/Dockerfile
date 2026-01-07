# Multi-stage build: build Spring Boot jar, then run on a slim Java 17 runtime

FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy Maven wrapper + pom first for better caching
COPY mvnw mvnw
COPY .mvn .mvn
COPY pom.xml pom.xml
RUN chmod +x mvnw
RUN ./mvnw -DskipTests dependency:go-offline

# Copy source and build
COPY src src
RUN ./mvnw -DskipTests package

FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=build /app/target/*.jar /app/app.jar

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "java -jar /app/app.jar --server.port=${PORT}"]
