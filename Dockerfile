# Multi-stage build

# Stage 1: Build the frontend
FROM node:22 AS frontend_builder
WORKDIR /app
COPY frontend/package*.json .
RUN npm install
COPY frontend .
RUN npm run build


# Stage 2: Build the backend
FROM maven:3.9.10-eclipse-temurin-24 AS backend_builder
WORKDIR /app
COPY backend/pom.xml .
RUN mvn dependency:go-offline
COPY backend/src ./src
COPY --from=frontend_builder /app/dist ./src/main/resources/static
RUN mvn -DskipTests package


# Stage 3: Create the app image
FROM eclipse-temurin:24-jre-alpine
WORKDIR /app
COPY --from=backend_builder /app/target/planning-poker.jar .
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "planning-poker.jar"]