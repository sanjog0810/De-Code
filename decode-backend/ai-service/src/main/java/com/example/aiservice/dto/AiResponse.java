package com.example.aiservice.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class AiResponse {
    private String reply;
    public AiResponse(String reply){
        this.reply = reply;
    }


}
