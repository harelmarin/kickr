package com.kickr_server.config;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.net.URI;

@RestController
@org.springframework.web.bind.annotation.CrossOrigin
public class ImageProxyController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/api/proxy/image")
    public ResponseEntity<byte[]> proxyImage(@RequestParam String url) {
        try {
            org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
            headers.set("User-Agent",
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

            org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(headers);

            ResponseEntity<byte[]> response = restTemplate.exchange(
                    new URI(url),
                    org.springframework.http.HttpMethod.GET,
                    entity,
                    byte[].class);

            byte[] imageBytes = response.getBody();

            // Try to determine content type from extension
            MediaType mediaType = MediaType.IMAGE_PNG;
            if (url.toLowerCase().endsWith(".jpg") || url.toLowerCase().endsWith(".jpeg")) {
                mediaType = MediaType.IMAGE_JPEG;
            } else if (url.toLowerCase().endsWith(".webp")) {
                mediaType = MediaType.parseMediaType("image/webp");
            } else if (response.getHeaders().getContentType() != null) {
                mediaType = response.getHeaders().getContentType();
            }

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .body(imageBytes);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
