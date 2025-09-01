# Build stage
FROM maven:3-openjdk-17 AS build
WORKDIR /app
COPY backend/pom.xml ./backend/
COPY backend/src ./backend/src/
RUN cd backend && mvn clean package -DskipTests

# Runtime stage
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/backend/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
