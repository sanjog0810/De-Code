package com.example.questionservice.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.UnsupportedJwtException;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    // Your secret key for signing JWTs (must match what your auth server uses)
    private static final String SECRET_KEY = "PTW3V9Ww0Lq/pSUID2s9IcGa9+OxjU+zuv67gcVO6OQ=";

    /**
     * Extracts email (or username) from JWT token
     */
    public static String getEmailFromToken(String token) {
        try {
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            // Assuming the email is stored in "sub" claim
            return claims.getSubject();

        } catch (SignatureException | MalformedJwtException | UnsupportedJwtException e) {
            throw new RuntimeException("Invalid JWT token");
        } catch (ExpiredJwtException e) {
            throw new RuntimeException("JWT token has expired");
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("JWT token is empty or null");
        }
    }

    /**
     * Optional: Validate JWT token
     */
    public static boolean validateToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
