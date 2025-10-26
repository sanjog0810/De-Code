package com.example.userservice.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.io.Serializable;


@Entity
@Table(name = "users",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Users implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 50)
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Email should be valid")
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Column(nullable = false)
    @ToString.Exclude // avoids printing password in logs
    private String password;

    public Users(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}

