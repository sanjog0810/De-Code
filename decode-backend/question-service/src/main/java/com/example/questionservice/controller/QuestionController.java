package com.example.questionservice.controller;

import com.example.questionservice.service.JwtUtil;
import com.example.questionservice.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/questions")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @Autowired
    private JwtUtil jwtUtils;

    @GetMapping("/random")
    public String getRandomQuestion(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            System.out.println("random question called");// remove "Bearer "
            String email = jwtUtils.getEmailFromToken(token); // parse JWT to get email
            return questionService.getRandomQuestion(email);
        } catch (Exception e) {
            return "<h3>Error loading question</h3>";
        }
    }
    @PostMapping("/chat")
    public String chatWithAi(@RequestBody String message,
                             @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("🟢 Received message: " + message);
            System.out.println("🟢 Authorization Header: " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("❌ Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            String email = jwtUtils.getEmailFromToken(token);
            System.out.println("🟢 Extracted email: " + email);

            String aiReply = questionService.chatWithAi(email, message);
            System.out.println("🟢 AI Reply: " + aiReply);

            return aiReply;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error chatting with AI: " + e.getMessage();
        }
    }

    @PostMapping("/submit")
    public String submitCode(@RequestBody String message,
                             @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("🟢 Received message: " + message);
            System.out.println("🟢 Authorization Header: " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("❌ Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            String email = jwtUtils.getEmailFromToken(token);
            System.out.println("🟢 Extracted email: " + email);

            String aiReply = questionService.submitCode(email,message);
            System.out.println("🟢 AI Reply: " + aiReply);

            return aiReply;
        } catch (Exception e) {
            e.printStackTrace();
            return "Error chatting with AI: " + e.getMessage();
        }
    }

    @GetMapping("/report")
    public ResponseEntity<Map<String, Object>> getReport(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            System.out.println("🟢 Authorization Header: " + authHeader);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new RuntimeException("❌ Missing or invalid Authorization header");
            }

            String token = authHeader.substring(7);
            String email = jwtUtils.getEmailFromToken(token);
            System.out.println("🟢 Extracted email: " + email);

            // ✅ Call report service
            Map<String, Object> report = questionService.generateReport(email);
            return ResponseEntity.ok(report);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = Map.of(
                    "error", true,
                    "message", "Error generating report: " + e.getMessage()
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }


}
