package com.kickr_server.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Getter
@Component
public class AppConfig {

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @Value("${jwt.secret:default_jwt_secret_must_be_changed_in_production_1234567890}")
    private String jwtSecret;

    @Value("${football.api.key:none}")
    private String footballApiKey;

}
