package com.university.coursemanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.time.LocalDateTime;

@Entity
@Table(name = "results")
public class Result {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({"registrations"})
    private Student student;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({"registrations"})
    private Course course;
    
    @NotNull(message = "Score is required")
    @DecimalMin(value = "0.0", message = "Score must be at least 0")
    @DecimalMax(value = "100.0", message = "Score must not exceed 100")
    private Double score;
    
    @Enumerated(EnumType.STRING)
    private Grade grade;
    
    @Enumerated(EnumType.STRING)
    private ExamType examType;
    
    private String remarks;
    
    @Column(name = "exam_date")
    private LocalDateTime examDate;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum Grade {
        A_PLUS("A+", 4.0), A("A", 4.0), A_MINUS("A-", 3.7),
        B_PLUS("B+", 3.3), B("B", 3.0), B_MINUS("B-", 2.7),
        C_PLUS("C+", 2.3), C("C", 2.0), C_MINUS("C-", 1.7),
        D_PLUS("D+", 1.3), D("D", 1.0), F("F", 0.0);
        
        private final String displayName;
        private final Double gpaValue;
        
        Grade(String displayName, Double gpaValue) {
            this.displayName = displayName;
            this.gpaValue = gpaValue;
        }
        
        public String getDisplayName() { return displayName; }
        public Double getGpaValue() { return gpaValue; }
        
        public static Grade fromScore(Double score) {
            if (score >= 85) return A_PLUS;
            if (score >= 70) return A;
            if (score >= 65) return A_MINUS;
            if (score >= 60) return B_PLUS;
            if (score >= 55) return B;
            if (score >= 50) return B_MINUS;
            if (score >= 45) return C_PLUS;
            if (score >= 40) return C;
            if (score >= 35) return C_MINUS;
            if (score >= 30) return D_PLUS;
            if (score >= 25) return D;
            return F;
        }
    }
    
    public enum ExamType {
        MIDTERM, FINAL, QUIZ, ASSIGNMENT, PROJECT
    }
    
    // Constructors
    public Result() {}
    
    public Result(Student student, Course course, Double score, ExamType examType) {
        this.student = student;
        this.course = course;
        this.score = score;
        this.examType = examType;
        this.grade = Grade.fromScore(score);
        this.examDate = LocalDateTime.now();
    }
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (grade == null && score != null) {
            grade = Grade.fromScore(score);
        }
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (score != null) {
            grade = Grade.fromScore(score);
        }
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    
    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }
    
    public Double getScore() { return score; }
    public void setScore(Double score) { 
        this.score = score;
        if (score != null) {
            this.grade = Grade.fromScore(score);
        }
    }
    
    public Grade getGrade() { return grade; }
    public void setGrade(Grade grade) { this.grade = grade; }
    
    public ExamType getExamType() { return examType; }
    public void setExamType(ExamType examType) { this.examType = examType; }
    
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    
    public LocalDateTime getExamDate() { return examDate; }
    public void setExamDate(LocalDateTime examDate) { this.examDate = examDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
