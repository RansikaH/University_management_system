package com.university.coursemanagement.entity;

public enum Role {
    ADMIN("Administrator - Full system access"),
    INSTRUCTOR("Instructor - Manage courses and grades"),
    STUDENT("Student - View courses and grades"),
    REGISTRAR("Registrar - Manage student registrations");
    
    private final String description;
    
    Role(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
