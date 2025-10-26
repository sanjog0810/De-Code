package com.products.sessionservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Document(collection = "sessions")
public class Session {

    @Id
    private String id;
    private String userId;
    private String question;
    private List<ChatMessage> chatHistory;
    private CodeResult codeResult;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;

    // Getters & Setters
    // Constructors
}

