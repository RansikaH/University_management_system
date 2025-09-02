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

### 🎯 **Core Management Features**
- ✅ **Advanced Course Management**: Complete CRUD operations with search, filtering, and capacity tracking
- ✅ **Comprehensive Student Management**: Full student profiles with contact information and academic history
- ✅ **Smart Registration System**: Enrollment management with status tracking and conflict prevention
- ✅ **Results & Grading System**: Complete grade management with multiple exam types and automatic calculations
- ✅ **Student Transcript System**: Individual academic transcripts with GPA calculation and performance analytics
- ✅ **Course Results Analysis**: Course performance dashboards with grade distribution and statistics

### 🔧 **Technical Features**
- ✅ **REST API**: 25+ RESTful endpoints with comprehensive CRUD operations
- ✅ **Advanced Search**: Real-time search across courses, students, and results with filtering
- ✅ **Database Integration**: JPA/Hibernate with MySQL and H2 support
- ✅ **Data Validation**: Client and server-side validation with error handling
- ✅ **Responsive Design**: Mobile-first Bootstrap design with modern UI components
- ✅ **Real-time Updates**: Dynamic data fetching with loading states and auto-refresh

### 📊 **Analytics & Reporting**
- ✅ **Dashboard Analytics**: Real-time statistics and performance metrics
- ✅ **GPA Calculation**: Automatic grade point average computation
- ✅ **Grade Distribution**: Visual representation of course performance
- ✅ **Performance Tracking**: Individual and course-level analytics
- ✅ **Statistical Reports**: Comprehensive academic performance insights

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

### 📚 Course Management API
- `GET /api/courses` - Get all courses
- `GET /api/courses/{id}` - Get course by ID
- `GET /api/courses/code/{code}` - Get course by code
- `GET /api/courses/search?title={title}&instructor={instructor}` - Search courses
- `GET /api/courses/available` - Get available courses
- `GET /api/courses/test` - Backend connectivity test
- `POST /api/courses` - Create new course
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course

### 👥 Student Management API
- `GET /api/students` - Get all students
- `GET /api/students/{id}` - Get student by ID
- `GET /api/students/student-id/{studentId}` - Get by student ID
- `GET /api/students/search?name={name}` - Search students by name
- `POST /api/students` - Create new student
- `PUT /api/students/{id}` - Update student
- `DELETE /api/students/{id}` - Delete student

### 📝 Registration Management API
- `GET /api/registrations` - Get all registrations
- `GET /api/registrations/student/{studentId}` - Get registrations by student
- `GET /api/registrations/course/{courseId}` - Get registrations by course
- `POST /api/registrations` - Create new registration
- `PUT /api/registrations/{id}` - Update registration (status, grade)
- `DELETE /api/registrations/{id}` - Delete registration

### 📊 Results & Grading API
- `GET /api/results` - Get all results
- `GET /api/results/{id}` - Get result by ID
- `GET /api/results/student/{studentId}` - Get results by student
- `GET /api/results/course/{courseId}` - Get results by course
- `GET /api/results/student/{studentId}/course/{courseId}` - Get specific student-course results
- `GET /api/results/student/{studentId}/gpa` - Calculate student GPA
- `GET /api/results/student/{studentId}/average` - Get student average score
- `GET /api/results/course/{courseId}/average` - Get course average score
- `POST /api/results` - Create new result
- `PUT /api/results/{id}` - Update result
- `DELETE /api/results/{id}` - Delete result

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

## 🎨 UI Features & Functionality

### 📊 **Interactive Dashboard**
- **Real-time Statistics Cards**: Total courses, students, registrations, available courses, and results
- **Dynamic Data Fetching**: Auto-refreshing statistics with loading states
- **Welcome Information Panel**: System overview and feature highlights
- **Color-coded Badges**: Visual indicators for different metrics

### 📚 **Advanced Course Management**
- **Complete CRUD Operations**: Create, read, update, delete courses
- **Real-time Search**: Search courses by title with instant results
- **Inline Editing**: Modal-based course updates with form validation
- **Course Details**: Title, code, description, credits, instructor, max students
- **Availability Tracking**: Monitor course capacity and enrollment limits
- **Responsive Tables**: Sortable and filterable course listings
- **Action Buttons**: Quick access to edit and delete functions

### 👥 **Comprehensive Student Management**
- **Student Profiles**: Full student information with unique IDs
- **Advanced Search**: Search by name with auto-complete functionality
- **Modal-based Updates**: In-place editing with validation
- **Contact Information**: Email, phone, date of birth tracking
- **Auto-refresh**: Window focus detection for data synchronization
- **Bulk Operations**: Efficient student data management

### 📝 **Registration & Enrollment System**
- **Smart Registration**: Dropdown selection for students and courses
- **Status Management**: Track enrollment status (Enrolled, Completed, Dropped, Pending)
- **Grade Tracking**: Record and update student grades
- **Registration History**: Complete enrollment timeline with dates
- **Conflict Prevention**: Duplicate registration validation
- **Capacity Management**: Automatic availability checking

### 📊 **Results & Grading System**
- **Comprehensive Grade Management**: Full CRUD operations for student results
- **Multiple Exam Types**: Final, Midterm, Quiz, Assignment, Project
- **Automatic Grade Calculation**: Score-to-grade conversion (A+ to F scale)
- **Advanced Filtering**: Filter by student, course, or both
- **Color-coded Scores**: Visual indicators for performance levels
- **Detailed Remarks**: Additional comments and feedback
- **Grade Distribution**: Statistical analysis of course performance

### 📋 **Student Transcript System**
- **Individual Transcripts**: Complete academic history per student
- **GPA Calculation**: Automatic GPA computation with grade points
- **Overall Statistics**: Average scores and total courses completed
- **Course History**: Chronological listing of all completed courses
- **Performance Analytics**: Visual grade representation with badges

### 📈 **Course Results Analysis**
- **Course Performance Dashboard**: Comprehensive course analytics
- **Class Statistics**: Average scores and grade distribution
- **Student Performance Tracking**: Individual results within courses
- **Grade Distribution Charts**: Visual representation of class performance
- **Instructor Analytics**: Course-specific performance metrics

### 🎨 **Modern UI/UX Design**
- **Responsive Bootstrap Design**: Mobile-first, works on all devices
- **Interactive Components**: Modals, dropdowns, badges, alerts
- **Color-coded Elements**: Intuitive visual feedback system
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: User-friendly error messages and validation
- **Navigation**: Clean, intuitive navigation with active states
- **Card-based Layout**: Modern, organized information presentation
- **Action Dropdowns**: Contextual actions with icons
- **Form Validation**: Real-time input validation and feedback

### 🔍 **Search & Filter Capabilities**
- **Global Search**: Search across courses, students, and results
- **Advanced Filters**: Multi-criteria filtering options
- **Real-time Results**: Instant search with auto-complete
- **Reset Functionality**: Quick return to full listings
- **Cross-reference Search**: Filter results by multiple entities

### 📱 **Responsive Features**
- **Mobile Optimization**: Touch-friendly interface elements
- **Tablet Support**: Optimized layouts for medium screens
- **Desktop Enhancement**: Full-featured experience on large screens
- **Cross-browser Compatibility**: Works on all modern browsers
- **Accessibility**: Screen reader friendly and keyboard navigation

### 🔧 **Advanced Technical Features**
- **Connection Testing**: Built-in backend connectivity verification
- **Auto-refresh**: Window focus detection for real-time data sync
- **Modal Management**: Sophisticated popup forms with validation
- **State Management**: Efficient React hooks for data handling
- **API Integration**: Centralized service layer with error handling
- **Grade Automation**: Automatic grade calculation from scores (A+ to F scale)
- **Timestamp Tracking**: Creation and update timestamps for all entities
- **Enum Management**: Structured data types for grades and exam types

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
