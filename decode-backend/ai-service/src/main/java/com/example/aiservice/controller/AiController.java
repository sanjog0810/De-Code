package com.example.aiservice.controller;

import com.example.aiservice.dto.AiRequest;
import com.example.aiservice.dto.AiResponse;
import com.example.aiservice.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {
    @Autowired
    private AiService aiService;

    @PostMapping("/reply")
    public AiResponse getReply(@RequestBody AiRequest aiRequest) {
        return aiService.getReply(aiRequest);
    }
}
