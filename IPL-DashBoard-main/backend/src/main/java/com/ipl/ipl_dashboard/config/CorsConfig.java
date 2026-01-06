package com.ipl.ipl_dashboard.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // Allow local dev and Vercel deployments (including preview URLs)
                .allowedOriginPatterns(
                        "http://localhost:3000",
                        "https://*.vercel.app",
                        "https://ipl-dashboard-frontend.vercel.app"
                )
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                // Do not use credentials with wildcard/origin patterns unless needed
                .allowCredentials(false)
                .maxAge(3600);
    }
}
