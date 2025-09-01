package com.university.coursemanagement.controller;

import com.university.coursemanagement.entity.Course;
import com.university.coursemanagement.repository.CourseRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @GetMapping
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseRepository.findById(id);
        return course.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/code/{code}")
    public ResponseEntity<Course> getCourseByCode(@PathVariable String code) {
        Optional<Course> course = courseRepository.findByCode(code);
        return course.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/search")
    public List<Course> searchCourses(@RequestParam(required = false) String title,
                                     @RequestParam(required = false) String instructor) {
        if (title != null && !title.isEmpty()) {
            return courseRepository.findByTitleContainingIgnoreCase(title);
        } else if (instructor != null && !instructor.isEmpty()) {
            return courseRepository.findByInstructorContainingIgnoreCase(instructor);
        }
        return courseRepository.findAll();
    }
    
    @GetMapping("/available")
    public List<Course> getAvailableCourses() {
        return courseRepository.findAvailableCourses();
    }
    
    @GetMapping("/test")
    public String testBackend() {
        return "Backend is running!";
    }
    
    @PostMapping
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course) {
        try {
            Course savedCourse = courseRepository.save(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedCourse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody Course courseDetails) {
        Optional<Course> optionalCourse = courseRepository.findById(id);
        
        if (optionalCourse.isPresent()) {
            Course course = optionalCourse.get();
            course.setTitle(courseDetails.getTitle());
            course.setCode(courseDetails.getCode());
            course.setDescription(courseDetails.getDescription());
            course.setCredits(courseDetails.getCredits());
            course.setInstructor(courseDetails.getInstructor());
            course.setMaxStudents(courseDetails.getMaxStudents());
            
            Course updatedCourse = courseRepository.save(course);
            return ResponseEntity.ok(updatedCourse);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
