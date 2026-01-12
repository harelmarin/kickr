package com.kickr_server;

import com.kickr_server.config.AppConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class KickrServerApplication {

    public KickrServerApplication(AppConfig appProperties) {
    }

    public static void main(String[] args) {
        SpringApplication.run(KickrServerApplication.class, args);
    }
}
