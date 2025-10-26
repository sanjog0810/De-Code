package com.example.questionservice.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "sessions")
public class Session {

    @Id
    private String id;  // MongoDB auto-generates ObjectId

    @Indexed(unique = true) // ✅ Ensure only one session per user
    private String userEmail;

    private String question;

    private List<ChatMessage> chatHistory = new ArrayList<>(); // initialize to avoid null

    private CodeResult codeResult;

    private LocalDateTime startedAt = LocalDateTime.now();
    private LocalDateTime endedAt;
}
