package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.model.ImageResource;
import com.ipl.ipl_dashboard.repository.ImageResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/images")
public class ImageController {

    private final ImageResourceRepository imageResourceRepo;

    @GetMapping
    public List<ImageResource> getAllImages() {
        return imageResourceRepo.findAll();
    }

    @GetMapping("/team/{teamName}")
    public ImageResource getTeamLogo(@PathVariable String teamName) {
        List<ImageResource> logos = imageResourceRepo.findByNameIgnoreCaseAndType(teamName, "team");
        return logos.isEmpty() ? null : logos.get(0);
    }

    @GetMapping("/player/{playerName}")
    public ImageResource getPlayerImage(@PathVariable String playerName) {
        List<ImageResource> images = imageResourceRepo.findByNameIgnoreCaseAndType(playerName, "player");
        return images.isEmpty() ? null : images.get(0);
    }
}
