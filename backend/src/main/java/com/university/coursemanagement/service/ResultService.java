package com.university.coursemanagement.service;

import com.university.coursemanagement.entity.Result;
import com.university.coursemanagement.repository.ResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResultService {
    
    @Autowired
    private ResultRepository resultRepository;
    
    public Double calculateStudentGPA(Long studentId) {
        List<Result> results = resultRepository.findByStudentId(studentId);
        if (results.isEmpty()) return 0.0;
        
        double totalGradePoints = results.stream()
            .mapToDouble(r -> r.getGrade().getGpaValue())
            .sum();
        
        return totalGradePoints / results.size();
    }
    
    public Map<String, Object> getStudentTranscript(Long studentId) {
        List<Result> results = resultRepository.findByStudentId(studentId);
        
        Map<String, List<Result>> resultsByCourse = results.stream()
            .collect(Collectors.groupingBy(r -> r.getCourse().getCode()));
        
        Double gpa = calculateStudentGPA(studentId);
        Double average = resultRepository.calculateOverallAverageByStudent(studentId);
        
        return Map.of(
            "results", results,
            "resultsByCourse", resultsByCourse,
            "gpa", gpa != null ? gpa : 0.0,
            "average", average != null ? average : 0.0,
            "totalCourses", resultsByCourse.size()
        );
    }
    
    public Map<String, Object> getCourseStatistics(Long courseId) {
        List<Result> results = resultRepository.findByCourseId(courseId);
        
        if (results.isEmpty()) {
            return Map.of(
                "average", 0.0,
                "totalStudents", 0,
                "gradeDistribution", Map.of()
            );
        }
        
        Double average = results.stream()
            .mapToDouble(Result::getScore)
            .average()
            .orElse(0.0);
        
        Map<Result.Grade, Long> gradeDistribution = results.stream()
            .collect(Collectors.groupingBy(Result::getGrade, Collectors.counting()));
        
        return Map.of(
            "average", average,
            "totalStudents", results.size(),
            "gradeDistribution", gradeDistribution,
            "results", results
        );
    }
}
