# Deployment Instructions

## Local Development Setup

### Prerequisites
- Java 17 or higher
- Node.js 16+ and npm
- Maven 3.6+
- Git

### Step 1: Clone and Setup Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
Backend will be available at: `http://localhost:8080`

### Step 2: Setup Frontend
```bash
cd frontend
npm install
npm start
```
Frontend will be available at: `http://localhost:3000`

## Production Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Using Docker Compose
```bash
# Start all services (MySQL + Application)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

#### Manual Docker Build
```bash
# Build application image
docker build -t university-management .

# Start MySQL
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=university_db \
  -p 3306:3306 mysql:8.0

# Start application
docker run -d --name university-app \
  -p 8080:8080 \
  --link mysql \
  -e SPRING_PROFILES_ACTIVE=mysql \
  university-management
```

### Option 2: Cloud Deployment

#### Heroku Deployment
1. Create `Procfile`:
```
web: java -jar backend/target/*.jar --server.port=$PORT
```

2. Deploy:
```bash
heroku create university-management-app
git push heroku main
```

#### Railway Deployment

**Backend Deployment:**
1. Connect GitHub repository to Railway
2. Set environment variables:
   - `SPRING_PROFILES_ACTIVE=mysql`
   - Database connection details
3. Railway will automatically detect Spring Boot and deploy

**Frontend Deployment:**
1. Create separate Railway service for frontend
2. Connect same GitHub repository
3. Set root directory to `frontend/`
4. Set build command: `npm run build`
5. Railway will automatically handle Docker deployment

**Docker Configuration:**
- Frontend uses nginx:alpine with port 8080
- Dockerfile handles React build and nginx setup
- nginx.conf configured for SPA routing with `try_files`

**Environment Variables:**
```bash
# Frontend
REACT_APP_API_URL=https://your-backend-railway-url.railway.app

# Backend  
SPRING_PROFILES_ACTIVE=mysql
SPRING_DATASOURCE_URL=jdbc:mysql://railway-mysql-host:3306/railway
SPRING_DATASOURCE_USERNAME=root
SPRING_DATASOURCE_PASSWORD=your-mysql-password
```

**Deployment URLs:**
- Frontend: `https://your-frontend.up.railway.app`
- Backend: `https://your-backend.railway.app`

#### Render Deployment
1. Create new Web Service
2. Connect repository
3. Set build command: `cd backend && mvn clean package`
4. Set start command: `java -jar backend/target/*.jar`

### Option 3: Traditional Server Deployment

#### Build for Production
```bash
# Backend
cd backend
mvn clean package -DskipTests

# Frontend
cd frontend
npm run build
```

#### Deploy to Tomcat/Application Server
1. Copy `backend/target/*.jar` to server
2. Copy `frontend/build/*` to web server
3. Configure database connection
4. Start application: `java -jar app.jar`

## Database Setup

### MySQL Production Setup
```sql
CREATE DATABASE university_db;
CREATE USER 'university_user'@'%' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON university_db.* TO 'university_user'@'%';
FLUSH PRIVILEGES;
```

### Environment Configuration
```bash
export SPRING_PROFILES_ACTIVE=mysql
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/university_db
export SPRING_DATASOURCE_USERNAME=university_user
export SPRING_DATASOURCE_PASSWORD=secure_password
```

## Monitoring and Maintenance

### Health Check Endpoints
- Application: `http://localhost:8080/actuator/health`
- Database: Check MySQL connection

### Log Files
- Application logs: Check console output or configure file logging
- Database logs: MySQL error logs

### Backup Strategy
```bash
# Database backup
mysqldump -u root -p university_db > backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u root -p university_db < backup_20231201.sql
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
```bash
# Find process using port 8080
netstat -ano | findstr :8080
# Kill process (Windows)
taskkill /PID <PID> /F
```

2. **Database Connection Issues**
- Check MySQL is running
- Verify connection credentials
- Check firewall settings

3. **CORS Issues**
- Verify frontend URL in backend CORS configuration
- Check browser developer tools for CORS errors

4. **Build Failures**
- Ensure Java 17+ is installed
- Clear Maven cache: `mvn clean`
- Check internet connection for dependencies

5. **Application Failed to Respond**
- Check Railway deployment logs for specific errors
- Verify Dockerfile syntax and nginx configuration
- Ensure app listens on correct port (usually 8080)
- Check environment variables are set correctly

6. **Docker Build Failures**
- Use simple Dockerfile approach without complex scripts
- Avoid heredoc syntax that may cause parsing issues
- Copy nginx.conf file instead of generating it dynamically
- Test Docker build locally before deploying

7. **Frontend Not Loading**
- Verify REACT_APP_API_URL points to correct backend URL
- Check nginx configuration for SPA routing (`try_files $uri $uri/ /index.html`)
- Ensure static files are copied to correct nginx directory
- Check browser network tab for failed requests

**Working Docker Configuration:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

**Working nginx.conf:**
```nginx
events {
    worker_connections 1024;
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    server {
        listen 8080;
        root /usr/share/nginx/html;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

### Performance Optimization

1. **Database Optimization**
- Add indexes for frequently queried fields
- Configure connection pooling
- Monitor query performance

2. **Application Optimization**
- Enable JPA query caching
- Configure appropriate JVM heap size
- Use production profiles

3. **Frontend Optimization**
- Enable gzip compression
- Use CDN for static assets
- Implement lazy loading

## Security Considerations

1. **Database Security**
- Use strong passwords
- Limit database user privileges
- Enable SSL connections

2. **Application Security**
- Keep dependencies updated
- Implement input validation
- Use HTTPS in production

3. **Network Security**
- Configure firewalls
- Use reverse proxy (nginx/Apache)
- Implement rate limiting
