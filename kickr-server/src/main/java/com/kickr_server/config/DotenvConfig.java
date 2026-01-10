package com.kickr_server.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

    static {
        // Look in current directory first, then try the parent directory
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        // If no entries found (or file missing), try parent directory
        if (dotenv.entries().isEmpty()) {
            dotenv = Dotenv.configure()
                    .directory("..")
                    .ignoreIfMissing()
                    .load();
        }

        dotenv.entries().forEach(entry -> {
            System.setProperty(entry.getKey(), entry.getValue());
        });
    }
}
