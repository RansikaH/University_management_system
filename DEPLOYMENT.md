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
1. Connect GitHub repository
2. Set environment variables:
   - `SPRING_PROFILES_ACTIVE=mysql`
   - Database connection details

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
