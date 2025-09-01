package com.university.coursemanagement.repository;

import com.university.coursemanagement.entity.Registration;
import com.university.coursemanagement.entity.Registration.RegistrationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    
    List<Registration> findByStudentId(Long studentId);
    
    List<Registration> findByCourseId(Long courseId);
    
    Optional<Registration> findByStudentIdAndCourseId(Long studentId, Long courseId);
    
    List<Registration> findByStatus(RegistrationStatus status);
    
    @Query("SELECT r FROM Registration r WHERE r.student.id = :studentId AND r.status = :status")
    List<Registration> findByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") RegistrationStatus status);
    
    @Query("SELECT COUNT(r) FROM Registration r WHERE r.course.id = :courseId AND r.status = 'ENROLLED'")
    Long countEnrolledStudentsByCourseId(@Param("courseId") Long courseId);
}
