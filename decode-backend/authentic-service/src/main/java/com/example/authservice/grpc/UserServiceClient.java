package com.example.authservice.grpc;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import userservice.UserRequest;
import userservice.UserResponse;
import userservice.UserServiceGrpc;

@Component
public class UserServiceClient {
    BCryptPasswordEncoder bcryptPasswordEncoder;

    private static final Logger log = LoggerFactory.getLogger(UserServiceClient.class);

    private final UserServiceGrpc.UserServiceBlockingStub blockingStub;

    public UserServiceClient(

            @Value("${user.service.address:localhost}") String serverAddress,
            @Value("${user.service.grpc.port:5010}") int serverPort) {

        log.info("Connecting to User Service gRPC at {}:{}", serverAddress, serverPort);

        ManagedChannel channel = ManagedChannelBuilder.forAddress(serverAddress, serverPort)
                .usePlaintext()
                .build();

        blockingStub = UserServiceGrpc.newBlockingStub(channel);
        bcryptPasswordEncoder = new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
    }

    public UserResponse addUser(String username, String email, String password) {

        UserRequest request = UserRequest.newBuilder()
                .setUsername(username)
                .setEmail(email)
                .setPassword( bcryptPasswordEncoder.encode(password))
                .build();

        UserResponse response = blockingStub.addUser(request); // matches proto method
        log.info("Received response from User Service via gRPC: {}", response);
        return response;
    }

    public UserResponse getUserByEmail(String email) {
        UserRequest request = UserRequest.newBuilder()
                .setEmail(email)
                .build();

        UserResponse response = blockingStub.getUserByEmail(request); // matches proto method
        log.info("Received response from User Service via gRPC: {}", response);
        return response;
    }
}
