package com.ipl.ipl_dashboard.scheduler;

import com.ipl.ipl_dashboard.service.LiveScoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class LiveScoreScheduler {

    private final SimpMessagingTemplate template;
    private final LiveScoreService liveScoreService;

    @Autowired
    public LiveScoreScheduler(SimpMessagingTemplate template, LiveScoreService liveScoreService) {
        this.template = template;
        this.liveScoreService = liveScoreService;
    }

    @Scheduled(fixedRate = 300000) // Send a new message every 5 seconds
    public void broadcastLiveScore() {
        Map<String, Object> liveScore = liveScoreService.getLiveScoreData();
        this.template.convertAndSend("/topic/live-score", liveScore);
        System.out.println("Broadcasted live score update: " + liveScore);
    }
}