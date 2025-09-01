# Multi-stage build for Spring Boot backend
FROM maven:3-openjdk-17 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Multi-stage build for React frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/src ./src
COPY frontend/public ./public
RUN npm run build

# Final stage - Spring Boot with embedded Tomcat
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy backend jar
COPY --from=backend-build /app/backend/target/*.jar app.jar

# Copy frontend build to static resources
COPY --from=frontend-build /app/frontend/build /app/static

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
