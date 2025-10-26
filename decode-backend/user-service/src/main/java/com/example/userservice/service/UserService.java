package com.example.userservice.service;

import com.example.userservice.model.Users;
import com.example.userservice.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepo usersRepository;

    // Create or update user
    public Users saveUser(Users user) {
        return usersRepository.save(user);
    }

    // Get all users
    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    // Get user by ID
    public Users getUserById(UUID id) {
        return usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    // Delete user
    public void deleteUser(UUID id) {
        if (!usersRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        usersRepository.deleteById(id);
    }

    // Get user by username
    public Users getUserByUsername(String username) {
        return usersRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
    }

    // Get user by email
    public Users getUserByEmail(String email) {
        return usersRepository.findByEmail(email)
                .orElse(null);
    }

}
