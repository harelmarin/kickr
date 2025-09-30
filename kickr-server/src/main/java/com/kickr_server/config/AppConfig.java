package com.kickr_server.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${football.api.key}")
    private String footballApiKey;

    public String getJwtSecret() {
        return jwtSecret;
    }

    public String getFootballApiKey() {
        return footballApiKey;
    }
}
