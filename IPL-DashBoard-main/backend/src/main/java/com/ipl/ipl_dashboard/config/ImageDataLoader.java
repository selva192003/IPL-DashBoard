package com.ipl.ipl_dashboard.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ipl.ipl_dashboard.model.ImageResource;
import com.ipl.ipl_dashboard.repository.ImageResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(1) // Run this before other data loaders
public class ImageDataLoader implements CommandLineRunner {

    private final ImageResourceRepository imageResourceRepo;
    private final ObjectMapper objectMapper;

    @Override
    public void run(String... args) throws Exception {
        // Only load image data if the table is empty
        if (imageResourceRepo.count() == 0) {
            try {
                // Load image data from JSON file
                InputStream inputStream = getClass().getResourceAsStream("/image-data.json");
                if (inputStream != null) {
                    List<ImageResource> imageResources = objectMapper.readValue(
                        inputStream, 
                        new TypeReference<List<ImageResource>>() {}
                    );
                    
                    imageResourceRepo.saveAll(imageResources);
                    System.out.println("✅ Image resources loaded: " + imageResources.size());
                } else {
                    System.err.println("❌ Could not find image-data.json file");
                }
            } catch (Exception e) {
                System.err.println("❌ Error loading image data: " + e.getMessage());
                e.printStackTrace();
            }
        } else {
            System.out.println("✅ Image resources already exist in database, skipping load");
        }
    }
}
