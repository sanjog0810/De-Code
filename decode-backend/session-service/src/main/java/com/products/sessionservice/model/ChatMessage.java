package com.products.sessionservice.model;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

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
