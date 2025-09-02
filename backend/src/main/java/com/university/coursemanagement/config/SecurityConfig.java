package com.university.coursemanagement.config;

import com.university.coursemanagement.security.JwtAuthenticationFilter;
import com.university.coursemanagement.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Autowired
    @Lazy
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserService userService) {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers(new AntPathRequestMatcher("/api/auth/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/h2-console/**")).permitAll()
                .requestMatchers(new AntPathRequestMatcher("/api/courses/test", "GET")).permitAll()
                
                // Admin only endpoints
                .requestMatchers(new AntPathRequestMatcher("/api/**", "DELETE")).hasRole("ADMIN")
                .requestMatchers(new AntPathRequestMatcher("/api/users/**")).hasRole("ADMIN")
                
                // Course management
                .requestMatchers(new AntPathRequestMatcher("/api/courses", "POST")).hasAnyRole("ADMIN", "INSTRUCTOR")
                .requestMatchers(new AntPathRequestMatcher("/api/courses/**", "PUT")).hasAnyRole("ADMIN", "INSTRUCTOR")
                .requestMatchers(new AntPathRequestMatcher("/api/courses/**", "GET")).hasAnyRole("ADMIN", "INSTRUCTOR", "REGISTRAR", "STUDENT")
                
                // Student management
                .requestMatchers(new AntPathRequestMatcher("/api/students", "POST")).hasAnyRole("ADMIN", "REGISTRAR")
                .requestMatchers(new AntPathRequestMatcher("/api/students/**", "PUT")).hasAnyRole("ADMIN", "REGISTRAR")
                .requestMatchers(new AntPathRequestMatcher("/api/students/**", "GET")).hasAnyRole("ADMIN", "INSTRUCTOR", "REGISTRAR")
                
                // Registration management
                .requestMatchers(new AntPathRequestMatcher("/api/registrations", "POST")).hasAnyRole("ADMIN", "REGISTRAR", "STUDENT")
                .requestMatchers(new AntPathRequestMatcher("/api/registrations/**", "PUT")).hasAnyRole("ADMIN", "REGISTRAR")
                .requestMatchers(new AntPathRequestMatcher("/api/registrations/**", "GET")).hasAnyRole("ADMIN", "INSTRUCTOR", "REGISTRAR", "STUDENT")
                
                // Results management
                .requestMatchers(new AntPathRequestMatcher("/api/results", "POST")).hasAnyRole("ADMIN", "INSTRUCTOR")
                .requestMatchers(new AntPathRequestMatcher("/api/results/**", "PUT")).hasAnyRole("ADMIN", "INSTRUCTOR")
                .requestMatchers(new AntPathRequestMatcher("/api/results/**", "GET")).hasAnyRole("ADMIN", "INSTRUCTOR", "STUDENT")
                
                // All other requests need authentication
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()))
            .build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
