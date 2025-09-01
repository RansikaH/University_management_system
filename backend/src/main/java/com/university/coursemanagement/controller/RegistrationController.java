package com.university.coursemanagement.controller;

import com.university.coursemanagement.entity.Registration;
import com.university.coursemanagement.entity.Course;
import com.university.coursemanagement.entity.Student;
import com.university.coursemanagement.repository.RegistrationRepository;
import com.university.coursemanagement.repository.CourseRepository;
import com.university.coursemanagement.repository.StudentRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/registrations")
@CrossOrigin(origins = "http://localhost:3000")
public class RegistrationController {
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @GetMapping
    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }
    
    @GetMapping("/student/{studentId}")
    public List<Registration> getRegistrationsByStudent(@PathVariable Long studentId) {
        return registrationRepository.findByStudentId(studentId);
    }
    
    @GetMapping("/course/{courseId}")
    public List<Registration> getRegistrationsByCourse(@PathVariable Long courseId) {
        return registrationRepository.findByCourseId(courseId);
    }
    
    @PostMapping
    public ResponseEntity<Registration> createRegistration(@RequestBody RegistrationRequest request) {
        Optional<Student> student = studentRepository.findById(request.getStudentId());
        Optional<Course> course = courseRepository.findById(request.getCourseId());
        
        if (student.isEmpty() || course.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Check if already registered
        Optional<Registration> existingRegistration = registrationRepository
            .findByStudentIdAndCourseId(request.getStudentId(), request.getCourseId());
        
        if (existingRegistration.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        // Check course capacity
        Long enrolledCount = registrationRepository.countEnrolledStudentsByCourseId(request.getCourseId());
        if (course.get().getMaxStudents() != null && enrolledCount >= course.get().getMaxStudents()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        Registration registration = new Registration(student.get(), course.get());
        Registration savedRegistration = registrationRepository.save(registration);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRegistration);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Registration> updateRegistration(@PathVariable Long id, @RequestBody Registration registrationDetails) {
        Optional<Registration> optionalRegistration = registrationRepository.findById(id);
        
        if (optionalRegistration.isPresent()) {
            Registration registration = optionalRegistration.get();
            registration.setStatus(registrationDetails.getStatus());
            registration.setGrade(registrationDetails.getGrade());
            
            Registration updatedRegistration = registrationRepository.save(registration);
            return ResponseEntity.ok(updatedRegistration);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRegistration(@PathVariable Long id) {
        if (registrationRepository.existsById(id)) {
            registrationRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    public static class RegistrationRequest {
        private Long studentId;
        private Long courseId;
        
        public Long getStudentId() {
            return studentId;
        }
        
        public void setStudentId(Long studentId) {
            this.studentId = studentId;
        }
        
        public Long getCourseId() {
            return courseId;
        }
        
        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }
    }
}
