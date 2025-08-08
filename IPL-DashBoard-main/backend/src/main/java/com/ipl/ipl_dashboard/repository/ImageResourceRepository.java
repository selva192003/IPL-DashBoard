package com.ipl.ipl_dashboard.repository;

import com.ipl.ipl_dashboard.model.ImageResource;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageResourceRepository extends JpaRepository<ImageResource, Long> {

    // Custom method to find images by name
    List<ImageResource> findByNameIgnoreCase(String name);

    // Custom method to find images by name and type
    List<ImageResource> findByNameIgnoreCaseAndType(String name, String type);

    // Custom method to find images by type
    List<ImageResource> findByType(String type);
}
