package com.example.aiservice.service;

import com.example.aiservice.dto.AiResponse;
import com.example.aiservice.dto.AiRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AiService {

    // 1. Update your application.properties to use 'gemini.api.key'
    @Value("${gemini.api.key}")
    private String apiKey;

    // 2. Use a more powerful, free-tier model from Google
    private final String MODEL = "gemini-2.5-flash-preview-09-2025";
    // 3. Update the API URL to the Google Gemini endpoint
    private final String API_URL = "https://generativelanguage.googleapis.com/v1beta/models/" + MODEL + ":generateContent";

    private final WebClient webClient = WebClient.builder().build();
    private final ObjectMapper mapper = new ObjectMapper();

    public AiResponse getReply(AiRequest request) {
        String prompt = request.getPrompt();

        // 4. Use the Gemini API's request format
        String requestBody = """
        {
          "contents": [
            {
              "parts": [
                {
                  "text": "%s"
                }
              ]
            }
          ]
        }
        """.formatted(prompt.replace("\"", "\\\""));

        return webClient.post()
                // 5. The API key is now passed as a query parameter
                .uri(API_URL + "?key=" + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                // 6. Remove OpenRouter-specific headers (Auth, Referer, Title)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .map(json -> {
                    String content = extractContentFromJson(json);
                    return new AiResponse(content);
                })
                // Add error handling for webclient requests
                .onErrorResume(e -> {
                    System.err.println("Error from AI service: " + e.getMessage());
                    return reactor.core.publisher.Mono.just(new AiResponse("Sorry, I couldn't get a response."));
                })
                .block();
    }

    /**
     * Extracts the text content from the Gemini API JSON response.
     * @param json The JSON response string from the API.
     * @return The extracted text content or an error message.
     */
    private String extractContentFromJson(String json) {
        try {
            JsonNode root = mapper.readTree(json);

            // 7. Parse the Gemini response structure
            JsonNode candidates = root.get("candidates");
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode parts = candidates.get(0).get("content").get("parts");
                if (parts != null && parts.isArray() && parts.size() > 0) {
                    return parts.get(0).get("text").asText();
                }
            }

            // Handle cases where the prompt was blocked (e.g., safety settings)
            if (root.has("promptFeedback")) {
                String blockReason = root.path("promptFeedback").path("blockReason").asText("UNKNOWN");
                return "Response blocked due to: " + blockReason;
            }

            return "No content found in the AI response.";
        } catch (Exception e) {
            System.err.println("Failed to parse AI response: " + json);
            return "Failed to parse AI response.";
        }
    }
}
