package com.bookstore.controller;

import com.bookstore.common.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Health Check Controller
 * Simple endpoint to verify the application is running
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ApiResponse<Map<String, Object>> health() {
        Map<String, Object> data = new HashMap<>();
        data.put("status", "UP");
        data.put("timestamp", LocalDateTime.now());
        data.put("version", "0.0.1-SNAPSHOT");
        return ApiResponse.success("Bookstore Backend is running successfully!", data);
    }

    @GetMapping("/")
    public ApiResponse<Map<String, String>> welcome() {
        Map<String, String> data = new HashMap<>();
        data.put("health", "/api/health");
        data.put("swagger", "/swagger-ui.html");
        data.put("h2Console", "/h2-console");
        data.put("documentation", "See IMPLEMENTATION_GUIDE.md for details");
        return ApiResponse.success("Welcome to Bookstore API", data);
    }
}

