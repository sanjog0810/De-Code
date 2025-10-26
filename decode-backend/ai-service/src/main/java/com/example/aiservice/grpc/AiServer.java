package com.example.aiservice.grpc;

import aiservice.UserRequest;
import aiservice.UserResponse;
import aiservice.UserServiceGrpc;
import com.example.aiservice.dto.AiRequest;
import com.example.aiservice.dto.AiResponse;
import com.example.aiservice.service.AiService;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@GrpcService
public class AiServer extends UserServiceGrpc.UserServiceImplBase {

    private final AiService aiService;

    public AiServer(AiService aiService) {
        this.aiService = aiService;
    }

    @Override
    public void getReply(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        log.info("Received gRPC request: {}", request.getPrompt());

        try {
            long startTime = System.currentTimeMillis();

            AiRequest aiRequest = new AiRequest();
            aiRequest.setPrompt(request.getPrompt());
            AiResponse response = aiService.getReply(aiRequest);

            UserResponse userResponse = UserResponse.newBuilder()
                    .setReply(response.getReply())
                    .build();

            long duration = System.currentTimeMillis() - startTime;
            log.info("Sending gRPC response: {}", response.getReply());
            log.info("Processing time: {} ms", duration);

            responseObserver.onNext(userResponse);
            responseObserver.onCompleted();
        } catch (Exception e) {
            log.error("Error while processing gRPC request", e);
            responseObserver.onError(e);
        }
    }
}
