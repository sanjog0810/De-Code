package com.example.userservice.controller;

import com.example.userservice.service.UserService;
import org.springframework.web.bind.annotation.RestController;
import com.example.userservice.model.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService usersService;

    // CREATE
    @PostMapping
    public ResponseEntity<Users> createUser(@RequestBody Users user) {
        Users savedUser = usersService.saveUser(user);
        return ResponseEntity.ok(savedUser);
    }

    // READ ALL
    @GetMapping
    public ResponseEntity<List<Users>> getAllUsers() {
        return ResponseEntity.ok(usersService.getAllUsers());
    }

    // READ BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Users> getUserById(@PathVariable UUID id) {
        return ResponseEntity.ok(usersService.getUserById(id));
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<Users> updateUser(@PathVariable UUID id, @RequestBody Users user) {
        Users existingUser = usersService.getUserById(id);
        existingUser.setUsername(user.getUsername());
        existingUser.setEmail(user.getEmail());
        existingUser.setPassword(user.getPassword());
        return ResponseEntity.ok(usersService.saveUser(existingUser));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable UUID id) {
        usersService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully with id: " + id);
    }
}
