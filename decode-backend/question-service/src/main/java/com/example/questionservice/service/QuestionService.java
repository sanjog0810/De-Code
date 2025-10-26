package com.example.questionservice.service;

import com.example.questionservice.grpc.GrpcClientService;
import com.example.questionservice.model.ChatMessage;
import com.example.questionservice.model.Session;
import com.example.questionservice.repository.SessionRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
public class QuestionService {

    @Autowired
    private SessionRepository sessionRepository;

    @Autowired
    private GrpcClientService grpcClientService;

    private final List<Resource> questionFiles = new ArrayList<>();
    private final Random random = new Random();

    public QuestionService() throws IOException {
        PathMatchingResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        Resource[] resources = resolver.getResources("classpath:questions/*.html");

        for (Resource res : resources) {
            if (res.exists()) {
                questionFiles.add(res);
            }
        }

        if (questionFiles.isEmpty()) {
            throw new IOException("No question files found in resources/questions/");
        }

        System.out.println("Loaded " + questionFiles.size() + " question paths.");
    }

    public String getRandomQuestion(String email) throws IOException {
        int index = random.nextInt(questionFiles.size());
        Resource resource = questionFiles.get(index);
        byte[] bytes = resource.getInputStream().readAllBytes();
        String questionHtml = new String(bytes, StandardCharsets.UTF_8);

        // ✅ Call async method to store session
        storeQuestionAsync(email, questionHtml);

        // ✅ Return raw HTML immediately
        return questionHtml;
    }

    @Async
    public void storeQuestionAsync(String email, String question) {
        try {
            String prompt = "extract all the information of question from the html code and do not give the solution full detailed question with everything remove tags from html: " + question;

            log.info("Sending ASYNC gRPC request for user: {}", email);
            String aiReply = grpcClientService.getAiReply(prompt);
            log.info("Received ASYNC gRPC response for user: {}", email);

            // ✅ Delete any existing session for this user
            sessionRepository.findByUserEmail(email)
                    .ifPresent(existing -> {
                        log.info("Deleting existing session for user: {}", email);
                        sessionRepository.deleteById(existing.getId());
                    });

            // ✅ Create new session
            Session session = new Session();
            session.setUserEmail(email);
            session.setQuestion(aiReply);
            session.setChatHistory(new ArrayList<>()); // start fresh
            session.setStartedAt(LocalDateTime.now());
            session.setEndedAt(null);

            sessionRepository.save(session);
            log.info("New session created for user: {}", email);

        } catch (Exception e) {
            log.error("Error in async storeQuestion for user {}: {}", email, e.getMessage(), e);
        }
    }

    public String chatWithAi(String email, String message) {
        Session session = sessionRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("No active session found for user: " + email));

        List<ChatMessage> chatHistory = session.getChatHistory();
        if (chatHistory == null) {
            chatHistory = new ArrayList<>();
        }

        // ✅ Prepare AI prompt
        String prompt = """
                You are an AI interviewer.
                The user is solving this question: %s.
                Chat history: %s
                User message: %s
                Rules:
                - Be strict and concise.
                - Reply in short direct sentences.
                - Do NOT provide the full solution or code.
                - Do NOT explain unless asked.
                """.formatted(session.getQuestion(), chatHistory, message);

        String aiReply = grpcClientService.getAiReply(prompt);

        // ✅ Update chat history
        chatHistory.add(new ChatMessage("user", message, LocalDateTime.now()));
        chatHistory.add(new ChatMessage("ai", aiReply, LocalDateTime.now()));
        session.setChatHistory(chatHistory);
        sessionRepository.save(session);

        return aiReply;
    }

    public String submitCode(String email, String code) {
        // 1️⃣ Fetch session for user
        Session session = sessionRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("No active session found for user: " + email));

        List<ChatMessage> chatHistory = session.getChatHistory();
        if (chatHistory == null) {
            chatHistory = new ArrayList<>();
        }

        // 2️⃣ Build AI prompt to evaluate the code
        String codeCheckPrompt = """
            You are an AI interviewer.
            The user has submitted code for this question: %s
            Code submitted: %s
            Chat history: %s
            Instructions:
            1. Check code cleanliness (naming, readability, structure).
            2. Check for proper edge case handling.
            3. Determine if all possible test cases will pass.
            4. If satisfied, ask user to explain the time complexity.
            5. If the code is brute-force, ask the user to optimize it further.
            6. Be concise and strict; do not give the full solution.
            """.formatted(session.getQuestion(), code, chatHistory);

        // 3️⃣ Send prompt to AI
        String aiReply = grpcClientService.getAiReply(codeCheckPrompt);

        // 4️⃣ Update chat history
        chatHistory.add(new ChatMessage("user", code, LocalDateTime.now()));
        chatHistory.add(new ChatMessage("ai", aiReply, LocalDateTime.now()));

        // 5️⃣ Save updated session
        session.setChatHistory(chatHistory);
        sessionRepository.save(session);

        // 6️⃣ Return AI's response
        return aiReply;
    }

    public Map<String, Object> generateReport(String email) {
        log.info("Generating interview report for user: {}", email);

        Session session = sessionRepository.findByUserEmail(email)
                .orElseThrow(() -> new RuntimeException("No session found for user: " + email));

        List<ChatMessage> chatHistory = session.getChatHistory() != null
                ? session.getChatHistory()
                : new ArrayList<>();

        String question = session.getQuestion();
        String lastUserCode = extractLastCodeFromChat(chatHistory);

        // Build the AI evaluation prompt
        String prompt = """
    You are an AI interviewer evaluating a coding interview session.
    
    ⚠️ IMPORTANT: Do NOT include any backticks (`), triple backticks (```), or any characters that could break JSON. 
    Feedback must be plain text, properly escaped, and JSON-safe.
    
    Based on the following information, generate a structured report:
    
    Candidate Email: %s
    Question: %s
    Chat History: %s
    Submitted Code: %s
    
    Instructions:
    1. Assign numeric scores (out of 10) for:
       - structure (code cleanliness, naming, readability)
       - logic (correctness, efficiency)
       - edgeCases (handling edge/test cases)
    2. Decide the final verdict as "Passed" or "Failed".
    3. Provide detailed but concise feedback.
    4. Return ONLY JSON in the following format:
    
    {
      "verdict": "Passed" or "Failed",
      "scores": {
        "structure": 0-10,
        "logic": 0-10,
        "edgeCases": 0-10
      },
      "feedback": "text feedback here"
    }
    """.formatted(email, question, chatHistory, lastUserCode);


        // Get AI reply
        String aiReply = grpcClientService.getAiReply(prompt);
        log.info("AI raw report for {}: {}", email, aiReply);

        // Parse JSON safely into a Map
        Map<String, Object> reportData = parseReportJson(aiReply);

        // Save report time
        session.setEndedAt(LocalDateTime.now());
        sessionRepository.save(session);

        return reportData;
    }
    private Map<String, Object> parseReportJson(String aiReply) {
        try {
            // 1️⃣ Trim whitespace
            aiReply = aiReply.trim();

            // 2️⃣ Replace all backticks (single ` or triple ```) with double quotes
            aiReply = aiReply.replaceAll("`{1,3}", "\"");

            // 3️⃣ Escape backslashes (\) for JSON
            aiReply = aiReply.replace("\\", "\\\\");

            // 4️⃣ Replace actual newlines with literal \n
            aiReply = aiReply.replaceAll("\r\n|\r|\n", "\\\\n");

            // 5️⃣ Escape quotes inside feedback to prevent JSON parsing errors


            // 6️⃣ Optional: remove other control characters
            aiReply = aiReply.replaceAll("[\\x00-\\x1F]", "");

            // 7️⃣ Parse JSON safely using Jackson
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            return mapper.readValue(aiReply, Map.class);

        } catch (Exception e) {
            log.error("Error parsing AI report JSON: {}", e.getMessage());
            // fallback default
            return Map.of(
                    "verdict", "Failed",
                    "scores", Map.of(
                            "structure", 0,
                            "logic", 0,
                            "edgeCases", 0
                    ),
                    "feedback", "Unable to parse AI response."
            );
        }
    }

    private String extractLastCodeFromChat(List<ChatMessage> chatHistory) {
        for (int i = chatHistory.size() - 1; i >= 0; i--) {
            ChatMessage msg = chatHistory.get(i);
            if ("user".equals(msg.getSender()) && msg.getMessage().contains("{")) {
                return msg.getMessage();
            }
        }
        return "No code submission found.";
    }



}
