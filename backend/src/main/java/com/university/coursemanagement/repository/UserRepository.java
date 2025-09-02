package com.university.coursemanagement.repository;

import com.university.coursemanagement.entity.Role;
import com.university.coursemanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    List<User> findByRole(Role role);
    
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
    
    @Query("SELECT u FROM User u WHERE u.enabled = true")
    List<User> findAllActiveUsers();
    
    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role")
    long countByRole(@Param("role") Role role);
    
    // Student-specific methods
    @Query("SELECT u FROM User u WHERE u.student.studentId = :studentId")
    Optional<User> findByStudentId(@Param("studentId") String studentId);
    
    @Query("SELECT u FROM User u WHERE u.student.studentId = :studentId AND u.role = 'STUDENT'")
    Optional<User> findStudentByStudentId(@Param("studentId") String studentId);
    
    boolean existsByStudentStudentId(String studentId);
}
