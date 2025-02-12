# # Stage 1: Build the React frontend
# FROM node:18-alpine as frontend-build
# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Stage 2: Build the Spring Boot backend
# FROM maven:3.9.9-eclipse-temurin-17-alpine as backend-build
# WORKDIR /app
# COPY ai-edu-be/pom.xml .
# COPY ai-edu-be/src ./src
# RUN mvn clean package -DskipTests

# # Stage 3: Final image
# FROM eclipse-temurin:17-jre-alpine
# WORKDIR /app

# # Copy the built frontend files to the static directory of the backend
# COPY --from=frontend-build /app/dist ./static
# # Copy the built backend jar
# COPY --from=backend-build /app/target/*.jar app.jar

# EXPOSE 8080
# ENTRYPOINT ["java", "-jar", "app.jar"] 

# Stage 1: Build frontend
FROM node:alpine as build

WORKDIR /usr/src/app

# Copy only package.json first to leverage Docker cache
COPY package.json ./

# Install dependencies using npm
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]