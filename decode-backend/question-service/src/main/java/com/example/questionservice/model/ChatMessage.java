package com.example.questionservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatMessage {
    private String sender; // "ai" or "user"
    private String message;
    private LocalDateTime timestamp;

    // Getters & Setters
    // Constructors
}
