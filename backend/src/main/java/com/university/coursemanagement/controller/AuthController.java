package com.university.coursemanagement.controller;

import com.university.coursemanagement.dto.JwtResponse;
import com.university.coursemanagement.dto.LoginRequest;
import com.university.coursemanagement.dto.RegisterRequest;
import com.university.coursemanagement.entity.Role;
import com.university.coursemanagement.entity.User;
import com.university.coursemanagement.entity.Student;
import com.university.coursemanagement.security.JwtUtil;
import com.university.coursemanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
            
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            User userPrincipal = (User) authentication.getPrincipal();
            
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", userPrincipal.getRole().name());
            claims.put("userId", userPrincipal.getId());
            
            String jwt = jwtUtil.generateToken(userPrincipal, claims);
            
            // Include student ID in the response if the user is a student
            Long studentId = null;
            if (userPrincipal.getStudent() != null) {
                studentId = userPrincipal.getStudent().getId();
            }
            
            JwtResponse response = new JwtResponse();
            response.setToken(jwt);
            response.setId(userPrincipal.getId());
            response.setUsername(userPrincipal.getUsername());
            response.setEmail(userPrincipal.getEmail());
            response.setFirstName(userPrincipal.getFirstName());
            response.setLastName(userPrincipal.getLastName());
            response.setRole(userPrincipal.getRole());
            response.setStudentId(studentId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: Invalid username or password!");
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        try {
            if (userService.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity.badRequest().body("Error: Username is already taken!");
            }
            
            if (userService.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest().body("Error: Email is already in use!");
            }
            
            // Create new user
            User user = new User(signUpRequest.getUsername(),
                    signUpRequest.getPassword(),
                    signUpRequest.getEmail(),
                    signUpRequest.getFirstName(),
                    signUpRequest.getLastName(),
                    signUpRequest.getRole());
            
            User savedUser = userService.createUser(user);
            
            return ResponseEntity.ok(Map.of("message", "User registered successfully!", "userId", savedUser.getId()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody Map<String, String> request) {
        try {
            String studentId = request.get("studentId");
            String password = request.get("password");
            String email = request.get("email");
            String firstName = request.get("firstName");
            String lastName = request.get("lastName");
            
            if (studentId == null || studentId.trim().isEmpty() ||
                email == null || email.trim().isEmpty() ||
                firstName == null || firstName.trim().isEmpty() ||
                lastName == null || lastName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Error: All fields are required");
            }
            
            if (password == null || password.length() < 6) {
                return ResponseEntity.badRequest().body("Error: Password must be at least 6 characters!");
            }
            
            User savedUser = userService.createStudentUser(
                studentId,  // username
                email,
                password,
                firstName,
                lastName,
                studentId
            );
            
            return ResponseEntity.ok(Map.of(
                "message", "Student account created successfully!", 
                "userId", savedUser.getId(),
                "studentId", studentId
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
    
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.badRequest().body("Error: Not authenticated");
        }
        
        User user = (User) authentication.getPrincipal();
        
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("id", user.getId());
        userInfo.put("username", user.getUsername());
        userInfo.put("email", user.getEmail());
        userInfo.put("firstName", user.getFirstName());
        userInfo.put("lastName", user.getLastName());
        userInfo.put("role", user.getRole());
        
        return ResponseEntity.ok(userInfo);
    }
    
    @GetMapping("/roles")
    public ResponseEntity<?> getAllRoles() {
        return ResponseEntity.ok(Role.values());
    }
    
    @GetMapping("/current/student")
    public ResponseEntity<Student> getCurrentUserStudent(Authentication authentication) {
        if (authentication != null && authentication.isAuthenticated()) {
            User user = (User) authentication.getPrincipal();
            if (user.getStudent() != null) {
                return ResponseEntity.ok(user.getStudent());
            }
        }
        return ResponseEntity.notFound().build();
    }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "User logged out successfully"));
    }
}
