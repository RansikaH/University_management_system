package com.university.coursemanagement.controller;

import com.university.coursemanagement.repository.CourseRepository;
import com.university.coursemanagement.repository.StudentRepository;
import com.university.coursemanagement.repository.RegistrationRepository;
import com.university.coursemanagement.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:3000")
public class TestController {
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private RegistrationRepository registrationRepository;
    
    @Autowired
    private ResultRepository resultRepository;
    
    @GetMapping("/data-count")
    public Map<String, Object> getDataCount() {
        Map<String, Object> counts = new HashMap<>();
        
        long courseCount = courseRepository.count();
        long studentCount = studentRepository.count();
        long registrationCount = registrationRepository.count();
        long resultCount = resultRepository.count();
        
        counts.put("courses", courseCount);
        counts.put("students", studentCount);
        counts.put("registrations", registrationCount);
        counts.put("results", resultCount);
        counts.put("message", "Data loaded successfully");
        
        return counts;
    }
    
    @GetMapping("/sample-data")
    public Map<String, Object> getSampleData() {
        Map<String, Object> data = new HashMap<>();
        
        data.put("courses", courseRepository.findAll());
        data.put("students", studentRepository.findAll());
        data.put("registrations", registrationRepository.findAll());
        data.put("results", resultRepository.findAll());
        
        return data;
    }
}
