# University Course Management System

A modern enterprise-level web application built with Spring Boot and React.js for managing university courses, students, and registrations.

## 🚀 Tech Stack

### Backend
- **Spring Boot 3.1.5** - Modern Java framework
- **Spring Data JPA** - Database abstraction layer
- **H2 Database** - In-memory database (development)
- **MySQL 8.0** - Production database
- **Maven** - Dependency management

### Frontend
- **React.js 18** - Modern UI library
- **React Router** - Client-side routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📋 Features

- ✅ **Course Management**: Create, view, edit, and delete courses
- ✅ **Student Management**: Manage student information and profiles
- ✅ **Registration System**: Handle course enrollments and track progress
- ✅ **Search Functionality**: Search courses and students
- ✅ **Responsive Design**: Modern, mobile-friendly UI
- ✅ **REST API**: RESTful web services with JSON
- ✅ **Database Integration**: JPA/Hibernate with MySQL support

## 🏗️ Project Structure

```
University_management_system/
├── backend/                 # Spring Boot application
│   ├── src/main/java/
│   │   └── com/university/coursemanagement/
│   │       ├── entity/      # JPA entities
│   │       ├── repository/  # Data repositories
│   │       ├── controller/  # REST controllers
│   │       └── config/      # Configuration classes
│   ├── src/main/resources/
│   │   ├── application.yml  # H2 configuration
│   │   ├── application-mysql.yml # MySQL configuration
│   │   └── data.sql        # Sample data
│   └── pom.xml             # Maven dependencies
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   ├── public/
│   └── package.json       # NPM dependencies
├── docker-compose.yml     # Docker orchestration
├── Dockerfile            # Multi-stage build
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites
- Java 17+
- Node.js 16+
- Maven 3.6+
- Docker (optional)

### Option 1: Local Development

#### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The backend will start on `http://localhost:8080`

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The frontend will start on `http://localhost:3000`

### Option 2: Docker Deployment

#### Using Docker Compose (Recommended)
```bash
# Start MySQL and application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

#### Manual Docker Build
```bash
# Build the application
docker build -t university-app .

# Run with MySQL
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 mysql:8.0
docker run -d --name university-app -p 8080:8080 --link mysql university-app
```

### Option 3: MySQL Database Setup

1. **Start MySQL using Docker:**
```bash
docker run -d -p 3306:3306 --name mysql -e MYSQL_ROOT_PASSWORD=root mysql:8.0
```

2. **Run backend with MySQL profile:**
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=mysql
```

## 📊 API Endpoints

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/code/{code}` - Get course by code
- `GET /api/courses/search?title={title}` - Search courses
- `GET /api/courses/available` - Get available courses
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### Students
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `GET /api/students/student-id/{studentId}` - Get by student ID
- `GET /api/students/search?name={name}` - Search students
- `POST /api/students` - Create new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### Registrations
- `GET /api/registrations` - Get all registrations
- `GET /api/registrations/student/{studentId}` - Get by student
- `GET /api/registrations/course/{courseId}` - Get by course
- `POST /api/registrations` - Create registration
- `PUT /api/registrations/{id}` - Update registration
- `DELETE /api/registrations/{id}` - Delete registration

## 🧪 Testing

### Backend Testing
```bash
cd backend
mvn test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use tools like Postman or curl to test the REST endpoints:
```bash
# Get all courses
curl http://localhost:8080/api/courses

# Create a new course
curl -X POST http://localhost:8080/api/courses \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Course","code":"TEST101","credits":3}'
```

## 🎨 UI Features

- **Dashboard**: Overview with statistics
- **Course Management**: Add, view, search, and delete courses
- **Student Management**: Manage student profiles
- **Registration System**: Enroll students in courses
- **Responsive Design**: Works on desktop and mobile
- **Modern UI**: Bootstrap-based design with cards and tables

## 🔧 Configuration

### Database Configuration
- **Development**: H2 in-memory database (default)
- **Production**: MySQL 8.0 (use `mysql` profile)

### CORS Configuration
The backend is configured to allow requests from `http://localhost:3000`

### Environment Variables
- `SPRING_PROFILES_ACTIVE`: Set to `mysql` for MySQL database
- `SPRING_DATASOURCE_URL`: Database connection URL
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

## 📈 Future Enhancements

- User authentication and authorization
- Grade management system
- Course scheduling and timetables
- Email notifications
- File upload for student documents
- Advanced reporting and analytics
- Mobile application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is created for educational purposes as part of the Modern Enterprise Application Development workshop.

## 📊 **Key Features Implemented**
- ✅ Modern tech stack (Spring Boot + React)
- ✅ RESTful APIs replacing Servlets
- ✅ React frontend replacing JSP
- ✅ Spring Data JPA replacing EJB
- ✅ YAML configuration replacing XML
- ✅ JSON APIs replacing SOAP
- ✅ Embedded Tomcat + Docker replacing Application Servers

## 🏆 **Results & Achievements**

### **Functional Requirements Met**
- ✅ **Course Management**: Full CRUD operations with search functionality
- ✅ **Student Management**: Complete student profile management
- ✅ **Registration System**: Course enrollment with capacity validation
- ✅ **Data Persistence**: JPA/Hibernate with H2 and MySQL support
- ✅ **REST API**: 15+ endpoints with proper HTTP methods and status codes
- ✅ **Modern UI**: Responsive React application with Bootstrap styling

### **Technical Achievements**
- ✅ **Zero Legacy Code**: Complete migration from Servlets/JSP/EJB to modern stack
- ✅ **Production Ready**: Docker containerization and deployment configurations
- ✅ **Database Flexibility**: H2 for development, MySQL for production
- ✅ **API Documentation**: Complete endpoint documentation with examples
- ✅ **Error Handling**: Proper validation and error responses
- ✅ **CORS Configuration**: Secure cross-origin resource sharing

### **Modern Enterprise Patterns**
- ✅ **Microservice Architecture**: Modular Spring Boot services
- ✅ **RESTful Design**: JSON-based API following REST principles
- ✅ **Dependency Injection**: Spring's IoC container
- ✅ **ORM Integration**: JPA/Hibernate for database abstraction
- ✅ **Configuration Management**: YAML-based external configuration
- ✅ **Containerization**: Docker for deployment consistency

### **User Experience**
- ✅ **Intuitive Dashboard**: Statistics overview with visual cards
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile
- ✅ **Real-time Updates**: Dynamic data fetching and display
- ✅ **Search Functionality**: Quick course and student lookup
- ✅ **Form Validation**: Client and server-side input validation
- ✅ **Modern UI Components**: Bootstrap-based professional interface

### **Development Best Practices**
- ✅ **Clean Architecture**: Separation of concerns (Entity, Repository, Controller)
- ✅ **Code Organization**: Proper package structure and naming conventions
- ✅ **Documentation**: Comprehensive README and deployment guides
- ✅ **Version Control Ready**: Git-friendly project structure
- ✅ **Testing Support**: Test configurations and sample data
- ✅ **Environment Profiles**: Development and production configurations

### **Performance & Scalability**
- ✅ **Connection Pooling**: HikariCP for database connections
- ✅ **Lazy Loading**: JPA lazy fetching for optimal performance
- ✅ **Caching Ready**: Spring Boot actuator endpoints for monitoring
- ✅ **Stateless Design**: RESTful stateless architecture
- ✅ **Horizontal Scaling**: Docker-ready for container orchestration

The application successfully demonstrates the transition from legacy enterprise technologies to modern, industry-standard solutions while maintaining enterprise-grade quality and scalability.

## 👥 Authors

- University Course Management System
- Built following modern enterprise development practices
- Spring Boot + React.js architecture

---

**Note**: This application demonstrates modern enterprise development practices by replacing legacy technologies (Servlets, JSP, EJB) with contemporary solutions (Spring Boot, React.js, REST APIs).
