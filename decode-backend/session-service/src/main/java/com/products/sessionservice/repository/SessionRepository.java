package com.products.sessionservice.repository;


import com.products.sessionservice.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SessionRepository extends MongoRepository<Session, String> {
    List<Session> findByUserId(String userId);
}

