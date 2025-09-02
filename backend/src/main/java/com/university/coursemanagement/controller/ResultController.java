package com.university.coursemanagement.controller;

import com.university.coursemanagement.entity.Result;
import com.university.coursemanagement.entity.Course;
import com.university.coursemanagement.entity.Student;
import com.university.coursemanagement.entity.User;
import com.university.coursemanagement.repository.ResultRepository;
import com.university.coursemanagement.repository.CourseRepository;
import com.university.coursemanagement.repository.StudentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/results")
@CrossOrigin(origins = "http://localhost:3000")
public class ResultController {
    
    @Autowired
    private ResultRepository resultRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @GetMapping
    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(@PathVariable Long id) {
        Optional<Result> result = resultRepository.findById(id);
        return result.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/student/{studentId}")
    public List<Result> getResultsByStudent(@PathVariable Long studentId) {
        return resultRepository.findByStudentId(studentId);
    }
    
    @GetMapping("/course/{courseId}")
    public List<Result> getResultsByCourse(@PathVariable Long courseId) {
        return resultRepository.findByCourseId(courseId);
    }
    
    @GetMapping("/student/{studentId}/course/{courseId}")
    public List<Result> getResultsByStudentAndCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        return resultRepository.findByStudentIdAndCourseId(studentId, courseId);
    }
    
    @GetMapping("/student/{studentId}/gpa")
    public ResponseEntity<Double> getStudentGPA(@PathVariable Long studentId) {
        Double gpa = resultRepository.calculateGPAByStudent(studentId);
        return ResponseEntity.ok(gpa != null ? gpa : 0.0);
    }
    
    @GetMapping("/student/{studentId}/average")
    public ResponseEntity<Double> getStudentAverage(@PathVariable Long studentId) {
        Double average = resultRepository.calculateOverallAverageByStudent(studentId);
        return ResponseEntity.ok(average != null ? average : 0.0);
    }
    
    @GetMapping("/my-results")
    public ResponseEntity<List<Result>> getCurrentUserResults(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = (User) authentication.getPrincipal();
            if (user.getStudent() != null) {
                List<Result> results = resultRepository.findByStudentId(user.getStudent().getId());
                return ResponseEntity.ok(results);
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/my-gpa")
    public ResponseEntity<Double> getCurrentUserGPA(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = (User) authentication.getPrincipal();
            if (user.getStudent() != null) {
                Double gpa = resultRepository.calculateGPAByStudent(user.getStudent().getId());
                return ResponseEntity.ok(gpa != null ? gpa : 0.0);
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/my-average")
    public ResponseEntity<Double> getCurrentUserAverage(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = (User) authentication.getPrincipal();
            if (user.getStudent() != null) {
                Double average = resultRepository.calculateOverallAverageByStudent(user.getStudent().getId());
                return ResponseEntity.ok(average != null ? average : 0.0);
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    @GetMapping("/course/{courseId}/average")
    public ResponseEntity<Double> getCourseAverage(@PathVariable Long courseId) {
        Double average = resultRepository.calculateCourseAverage(courseId);
        return ResponseEntity.ok(average != null ? average : 0.0);
    }
    
    @PostMapping
    public ResponseEntity<Result> createResult(@RequestBody ResultRequest request) {
        Optional<Student> student = studentRepository.findById(request.getStudentId());
        Optional<Course> course = courseRepository.findById(request.getCourseId());
        
        if (student.isEmpty() || course.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        Result result = new Result(student.get(), course.get(), request.getScore(), request.getExamType());
        result.setRemarks(request.getRemarks());
        if (request.getExamDate() != null) {
            result.setExamDate(request.getExamDate());
        }
        
        Result savedResult = resultRepository.save(result);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedResult);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Result> updateResult(@PathVariable Long id, @RequestBody ResultRequest request) {
        Optional<Result> optionalResult = resultRepository.findById(id);
        
        if (optionalResult.isPresent()) {
            Result result = optionalResult.get();
            result.setScore(request.getScore());
            result.setExamType(request.getExamType());
            result.setRemarks(request.getRemarks());
            if (request.getExamDate() != null) {
                result.setExamDate(request.getExamDate());
            }
            
            Result updatedResult = resultRepository.save(result);
            return ResponseEntity.ok(updatedResult);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResult(@PathVariable Long id) {
        if (resultRepository.existsById(id)) {
            resultRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    public static class ResultRequest {
        private Long studentId;
        private Long courseId;
        private Double score;
        private Result.ExamType examType;
        private String remarks;
        private java.time.LocalDateTime examDate;
        
        // Getters and Setters
        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        
        public Long getCourseId() { return courseId; }
        public void setCourseId(Long courseId) { this.courseId = courseId; }
        
        public Double getScore() { return score; }
        public void setScore(Double score) { this.score = score; }
        
        public Result.ExamType getExamType() { return examType; }
        public void setExamType(Result.ExamType examType) { this.examType = examType; }
        
        public String getRemarks() { return remarks; }
        public void setRemarks(String remarks) { this.remarks = remarks; }
        
        public java.time.LocalDateTime getExamDate() { return examDate; }
        public void setExamDate(java.time.LocalDateTime examDate) { this.examDate = examDate; }
    }
}
