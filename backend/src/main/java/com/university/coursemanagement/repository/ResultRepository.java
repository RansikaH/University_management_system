package com.university.coursemanagement.repository;

import com.university.coursemanagement.entity.Result;
import com.university.coursemanagement.entity.Result.ExamType;
import com.university.coursemanagement.entity.Result.Grade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultRepository extends JpaRepository<Result, Long> {
    
    List<Result> findByStudentId(Long studentId);
    
    List<Result> findByCourseId(Long courseId);
    
    List<Result> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    List<Result> findByExamType(ExamType examType);
    
    List<Result> findByGrade(Grade grade);
    
    @Query("SELECT r FROM Result r WHERE r.student.id = :studentId AND r.course.id = :courseId AND r.examType = :examType")
    List<Result> findByStudentCourseAndExamType(@Param("studentId") Long studentId, 
                                               @Param("courseId") Long courseId, 
                                               @Param("examType") ExamType examType);
    
    @Query("SELECT AVG(r.score) FROM Result r WHERE r.student.id = :studentId")
    Double calculateOverallAverageByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT AVG(r.score) FROM Result r WHERE r.course.id = :courseId")
    Double calculateCourseAverage(@Param("courseId") Long courseId);
    
    @Query("SELECT AVG(CASE " +
           "WHEN r.grade = 'A_PLUS' THEN 4.0 " +
           "WHEN r.grade = 'A' THEN 4.0 " +
           "WHEN r.grade = 'A_MINUS' THEN 3.7 " +
           "WHEN r.grade = 'B_PLUS' THEN 3.3 " +
           "WHEN r.grade = 'B' THEN 3.0 " +
           "WHEN r.grade = 'B_MINUS' THEN 2.7 " +
           "WHEN r.grade = 'C_PLUS' THEN 2.3 " +
           "WHEN r.grade = 'C' THEN 2.0 " +
           "WHEN r.grade = 'C_MINUS' THEN 1.7 " +
           "WHEN r.grade = 'D_PLUS' THEN 1.3 " +
           "WHEN r.grade = 'D' THEN 1.0 " +
           "ELSE 0.0 END) FROM Result r WHERE r.student.id = :studentId")
    Double calculateGPAByStudent(@Param("studentId") Long studentId);
    
    @Query("SELECT r FROM Result r WHERE r.student.id = :studentId ORDER BY r.examDate DESC")
    List<Result> findRecentResultsByStudent(@Param("studentId") Long studentId);
}
