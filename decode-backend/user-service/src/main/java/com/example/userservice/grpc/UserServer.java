package com.example.userservice.grpc;

import com.example.userservice.model.Users;
import com.example.userservice.service.UserService;
import io.grpc.stub.StreamObserver;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Autowired;
import userservice.UserRequest;
import userservice.UserResponse;
import userservice.UserServiceGrpc;
@GrpcService
public class UserServer extends UserServiceGrpc.UserServiceImplBase {

    private final UserService userService;

    public UserServer(UserService userService) {
        this.userService = userService;
    }

    @Override
    public void addUser(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        Users user = userService.saveUser(
            new Users(
                request.getUsername(),
                request.getEmail(),
                request.getPassword()
            )
        );
        UserResponse response = UserResponse.newBuilder()
                .setId(user.getId().toString())
                .setUsername(user.getUsername())
                .setEmail(user.getEmail())
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }

    @Override
    public void getUserByEmail(UserRequest request, StreamObserver<UserResponse> responseObserver) {
        Users user = userService.getUserByEmail(request.getEmail());
        if(user == null){
           UserResponse response = UserResponse.newBuilder()
                   .setExists(false)
                   .build();
           responseObserver.onNext(response);
           responseObserver.onCompleted();
           return;
        }
        UserResponse response = UserResponse.newBuilder()
                .setId(user.getId().toString())
                .setUsername(user.getUsername())
                .setEmail(user.getEmail())
                .setExists(true)
                .build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();

    }
}
