package com.university.coursemanagement.service;

import com.university.coursemanagement.entity.Role;
import com.university.coursemanagement.entity.User;
import com.university.coursemanagement.entity.Student;
import com.university.coursemanagement.repository.UserRepository;
import com.university.coursemanagement.repository.StudentRepository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    private final PasswordEncoder passwordEncoder;
    
    public UserService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // First try to find by username (for admin, instructor, registrar)
        Optional<User> user = userRepository.findByUsername(username);
        if (user.isPresent()) {
            return user.get();
        }
        
        // If not found, try to find by student ID (for students)
        user = userRepository.findByStudentId(username);
        if (user.isPresent()) {
            return user.get();
        }
        
        throw new UsernameNotFoundException("User not found: " + username);
    }
    
    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }
    
    @Transactional
    public User createStudentUser(String username, String email, String password, String firstName, String lastName, String studentId) {
        // Check if student exists
        Optional<Student> studentOpt = studentRepository.findByStudentId(studentId);
        if (studentOpt.isEmpty()) {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
        
        // Check if user already exists with this student ID
        if (userRepository.existsByStudentStudentId(studentId)) {
            throw new RuntimeException("User already exists for student ID: " + studentId);
        }
        
        // Create and save user
        User user = new User(username, password, email, firstName, lastName, Role.STUDENT);
        user.setPassword(passwordEncoder.encode(password));
        
        // Set student relationship
        Student student = studentOpt.get();
        user.setStudent(student);
        
        // Save the user (which will also update the student relationship)
        return userRepository.save(user);
    }
    
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }
    
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }
    
    public List<User> searchUsersByName(String name) {
        return userRepository.findByNameContaining(name);
    }
    
    public List<User> getActiveUsers() {
        return userRepository.findAllActiveUsers();
    }
    
    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setRole(userDetails.getRole());
        user.setEnabled(userDetails.isEnabled());
        
        return userRepository.save(user);
    }
    
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
    
    public boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }
    
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
    
    public long countUsersByRole(Role role) {
        return userRepository.countByRole(role);
    }
    
    public void changePassword(String username, String newPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }
    
    // Student-specific methods
    public Optional<User> getUserByStudentId(String studentId) {
        return userRepository.findByStudentId(studentId);
    }
    
    public Optional<User> getStudentByStudentId(String studentId) {
        return userRepository.findStudentByStudentId(studentId);
    }
    
    public boolean existsByStudentId(String studentId) {
        return userRepository.existsByStudentStudentId(studentId);
    }
    
    public User createStudentUser(String studentId, String password) {
        // Normalize student ID to uppercase for consistency
        String normalizedStudentId = studentId.toUpperCase().trim();
        
        // Check if student ID already has a user account
        if (existsByStudentId(normalizedStudentId)) {
            throw new RuntimeException("Student ID already has an account");
        }
        
        // Find the student record by student ID
        Optional<com.university.coursemanagement.entity.Student> studentOpt = 
            studentRepository.findByStudentId(normalizedStudentId);
        
        if (!studentOpt.isPresent()) {
            throw new RuntimeException("Student ID not found in university records");
        }
        
        com.university.coursemanagement.entity.Student student = studentOpt.get();
        
        // Create user account linked to student record
        User user = new User();
        user.setUsername(normalizedStudentId); // Use normalized student ID as username for consistency
        user.setPassword(passwordEncoder.encode(password));
        user.setEmail(student.getEmail());
        user.setFirstName(student.getFirstName());
        user.setLastName(student.getLastName());
        user.setRole(Role.STUDENT);
        user.setStudent(student);
        user.setEnabled(true);
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setCredentialsNonExpired(true);
        
        return userRepository.save(user);
    }
}
