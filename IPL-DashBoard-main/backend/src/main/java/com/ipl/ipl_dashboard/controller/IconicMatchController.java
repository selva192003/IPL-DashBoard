package com.ipl.ipl_dashboard.controller;

import com.ipl.ipl_dashboard.dto.IconicMatchDto;
import com.ipl.ipl_dashboard.service.IconicMatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class IconicMatchController {

    private final IconicMatchService iconicMatchService;

    public IconicMatchController(IconicMatchService iconicMatchService) {
        this.iconicMatchService = iconicMatchService;
    }

    @GetMapping("/iconic-match")
    public ResponseEntity<?> getIconicMatch() {
        IconicMatchDto dto = iconicMatchService.pickRandomIconicMatch();
        if (dto == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(dto);
    }
}
