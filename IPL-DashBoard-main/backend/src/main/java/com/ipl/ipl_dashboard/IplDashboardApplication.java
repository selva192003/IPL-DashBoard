package com.ipl.ipl_dashboard;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.reactive.function.client.WebClient;

@SpringBootApplication
@EnableScheduling
public class IplDashboardApplication {

    public static void main(String[] args) {
        SpringApplication.run(IplDashboardApplication.class, args);
    }

    // NEW: Bean to provide a WebClient.Builder instance for dependency injection
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

}