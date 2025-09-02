package com.university.coursemanagement.config;

import com.university.coursemanagement.entity.Role;
import com.university.coursemanagement.entity.User;
import com.university.coursemanagement.entity.Student;
import com.university.coursemanagement.repository.UserRepository;
import com.university.coursemanagement.repository.StudentRepository;
import com.university.coursemanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Only create sample users if they don't exist
        if (userRepository.count() == 0) {
            // Wait a bit for data.sql to be processed
            Thread.sleep(1000);
            createSampleUsers();
        }
    }
    
    private void createSampleUsers() {
        // Create admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("password"));
        admin.setEmail("admin@university.edu");
        admin.setFirstName("System");
        admin.setLastName("Administrator");
        admin.setRole(Role.ADMIN);
        admin.setEnabled(true);
        admin.setAccountNonExpired(true);
        admin.setAccountNonLocked(true);
        admin.setCredentialsNonExpired(true);
        userRepository.save(admin);
        
        // Create instructor user
        User instructor = new User();
        instructor.setUsername("instructor");
        instructor.setPassword(passwordEncoder.encode("password"));
        instructor.setEmail("instructor@university.edu");
        instructor.setFirstName("John");
        instructor.setLastName("Smith");
        instructor.setRole(Role.INSTRUCTOR);
        instructor.setEnabled(true);
        instructor.setAccountNonExpired(true);
        instructor.setAccountNonLocked(true);
        instructor.setCredentialsNonExpired(true);
        userRepository.save(instructor);
        
        // Create student user linked to existing Alice Johnson student record using student ID
        Student aliceStudent = studentRepository.findByEmail("alice.johnson@university.edu").orElse(null);
        if (aliceStudent != null) {
            try {
                userService.createStudentUser(
                    aliceStudent.getStudentId(),  // username
                    aliceStudent.getEmail(),
                    "password",
                    aliceStudent.getFirstName(),
                    aliceStudent.getLastName(),
                    aliceStudent.getStudentId()
                );
            } catch (Exception e) {
                System.err.println("Failed to create Alice's user: " + e.getMessage());
            }
        }
        
        // Create another student user linked to existing Bob Smith student record using student ID
        Student bobStudent = studentRepository.findByEmail("bob.smith@university.edu").orElse(null);
        if (bobStudent != null) {
            try {
                userService.createStudentUser(
                    bobStudent.getStudentId(),  // username
                    bobStudent.getEmail(),
                    "password",
                    bobStudent.getFirstName(),
                    bobStudent.getLastName(),
                    bobStudent.getStudentId()
                );
            } catch (Exception e) {
                System.err.println("Failed to create Bob's user: " + e.getMessage());
            }
        }
        
        // Create registrar user
        User registrar = new User();
        registrar.setUsername("registrar");
        registrar.setPassword(passwordEncoder.encode("password"));
        registrar.setEmail("registrar@university.edu");
        registrar.setFirstName("Mary");
        registrar.setLastName("Wilson");
        registrar.setRole(Role.REGISTRAR);
        registrar.setEnabled(true);
        registrar.setAccountNonExpired(true);
        registrar.setAccountNonLocked(true);
        registrar.setCredentialsNonExpired(true);
        userRepository.save(registrar);
        
        System.out.println("Sample users created successfully!");
    }
}
