package com.example.questionservice.grpc;

import aiservice.UserRequest;
import aiservice.UserResponse;
import aiservice.UserServiceGrpc;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.springframework.stereotype.Service;

@Service
public class GrpcClientService {

    private final UserServiceGrpc.UserServiceBlockingStub userServiceStub;

    public GrpcClientService() {
        // Connect to your gRPC server
        ManagedChannel channel = ManagedChannelBuilder
                .forAddress("ai-service", 5002) // replace port if different
                .usePlaintext()
                .build();

        userServiceStub = UserServiceGrpc.newBlockingStub(channel);
    }

    public String getAiReply(String prompt) {
        // Build request
        System.out.println("sending request");
        UserRequest request = UserRequest.newBuilder()
                .setPrompt(prompt)
                .build();

        // Get response from server
        UserResponse response = userServiceStub.getReply(request);
        System.out.println(response.getReply());

        return response.getReply();
    }
}

