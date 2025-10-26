package com.example.authservice.controller;

import com.example.authservice.dto.UserDto;
import com.example.authservice.grpc.UserServiceClient;
import com.example.authservice.util.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import userservice.UserRequest;
import userservice.UserResponse;
import userservice.UserServiceGrpc;

import java.util.Map;

@RestController
@RequestMapping("/auth")
//@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

        private final UserServiceClient userServiceClient;
        private final JwtUtil jwtUtil;
        private final BCryptPasswordEncoder bcryptPasswordEncoder;

    public AuthController(UserServiceClient userServiceClient, JwtUtil jwtUtil, BCryptPasswordEncoder bcryptPasswordEncoder) {
            this.userServiceClient = userServiceClient;
            this.jwtUtil = jwtUtil;
        this.bcryptPasswordEncoder = bcryptPasswordEncoder;
    }

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody UserDto userDto) {
            UserResponse userResponse = userServiceClient.addUser(
                    userDto.getUsername(),
                    userDto.getEmail(),
                    userDto.getPassword()
            );
            String token = jwtUtil.generateToken(userResponse.getUsername(),userResponse.getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(@RequestBody UserDto userDto) {
            UserResponse userResponse = userServiceClient.getUserByEmail(
                    userDto.getEmail()
            );
            if (!userResponse.getExists()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
            if(bcryptPasswordEncoder.matches(userDto.getPassword(), userResponse.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
            }
            String token = jwtUtil.generateToken(userResponse.getUsername(),userResponse.getEmail());
            return ResponseEntity.ok(Map.of("token", token));
        }
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "error", "Missing token"));
        }

        String token = authHeader.substring(7);
        try {
            boolean valid = jwtUtil.validateToken(token);
            if (!valid) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "error", "Invalid token"));
            }
            String username = jwtUtil.extractUsername(token);
            return ResponseEntity.ok(Map.of("valid", true, "username", username));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("valid", false, "error", e.getMessage()));
        }
    }


}


