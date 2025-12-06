package com.ipl.ipl_dashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow requests from these origins
        config.addAllowedOrigin("http://localhost:3000");                              // Local dev
        config.addAllowedOrigin("http://localhost:5173");                              // Vite dev
        config.addAllowedOrigin("https://ipl-dashboard-frontend.vercel.app");          // Vercel production (old)
        config.addAllowedOrigin("https://ipl-dash-board-tau.vercel.app");              // Vercel production (new)
        config.addAllowedOrigin("https://*.vercel.app");                               // All Vercel preview/prod URLs
        
        // Allow all HTTP methods
        config.addAllowedMethod("*");
        
        // Allow all headers
        config.addAllowedHeader("*");
        
        // Allow credentials (cookies, auth headers)
        config.setAllowCredentials(true);
        
        // Max age for preflight requests (1 hour)
        config.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}
