package com.example.questionservice.repository;


import com.example.questionservice.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends MongoRepository<Session, String> {
    Optional<Session> findByUserEmail(String s);
}

