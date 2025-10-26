package com.products.apigateway.filter;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import reactor.core.publisher.Mono;
import java.util.Map;

@Component
public class JwtAuthFilter implements GlobalFilter {

    @Value("${auth.service.url}")
    private String authServiceUrl; // http://localhost:4001

    private final WebClient webClient;

    public JwtAuthFilter(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Skip auth paths
        if (path.startsWith("/auth")) {
            return chain.filter(exchange);
        }

        // Get Authorization header
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        // Call auth-service /validate
        return webClient.method(HttpMethod.GET)
                .uri(authServiceUrl + "/auth/validate")
                .header(HttpHeaders.AUTHORIZATION, authHeader)
                .retrieve()
                .bodyToMono(Map.class)
                .flatMap(response -> {
                    Boolean valid = (Boolean) response.get("valid");
                    if (valid != null && valid) {
                        // Optional: pass username/email to downstream services
                        String username = (String) response.get("username");
                        exchange.getRequest().mutate()
                                .header("X-USER-NAME", username)
                                .build();
                        return chain.filter(exchange);
                    } else {
                        exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    }
                })
                .onErrorResume(e -> {
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                });
    }
}

