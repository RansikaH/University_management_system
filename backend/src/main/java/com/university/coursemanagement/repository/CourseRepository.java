package com.university.coursemanagement.repository;

import com.university.coursemanagement.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Optional<Course> findByCode(String code);
    
    List<Course> findByTitleContainingIgnoreCase(String title);
    
    List<Course> findByInstructorContainingIgnoreCase(String instructor);
    
    @Query("SELECT c FROM Course c WHERE c.credits >= :minCredits AND c.credits <= :maxCredits")
    List<Course> findByCreditsBetween(@Param("minCredits") Integer minCredits, @Param("maxCredits") Integer maxCredits);
    
    @Query("SELECT c FROM Course c LEFT JOIN c.registrations r GROUP BY c.id HAVING COUNT(r) < c.maxStudents OR c.maxStudents IS NULL")
    List<Course> findAvailableCourses();
}
