package com.example.questionservice.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CodeResult {
    private String status; // PASSED / FAILED
    private String output;
    private String executionTime;

    // Getters & Setters
    // Constructors
}

