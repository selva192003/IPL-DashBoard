package com.ipl.ipl_dashboard.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import reactor.util.retry.Retry;

@Service
public class LiveScoreService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    private static final String API_KEY = "9395e3e324msh3cffefd12124a60p1ad060jsnfdd2b9fd4aad";
    private static final String RAPIDAPI_HOST = "cricbuzz-cricket.p.rapidapi.com";
    private static final String API_BASE_URL = "https://cricbuzz-cricket.p.rapidapi.com";
    private static final String LIVE_MATCHES_ENDPOINT = "/matches/v1/live";

    @Autowired
    public LiveScoreService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.baseUrl(API_BASE_URL).build();
        this.objectMapper = objectMapper;
    }

    public Map<String, Object> getLiveScoreData() {
        try {
            String liveMatchesJson = this.webClient.get()
                    .uri(LIVE_MATCHES_ENDPOINT)
                    .header("x-rapidapi-key", API_KEY)
                    .header("x-rapidapi-host", RAPIDAPI_HOST)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(5))
                            .filter(throwable -> throwable instanceof WebClientResponseException && ((WebClientResponseException) throwable).getStatusCode().is4xxClientError()))
                    .block();

            JsonNode rootNode = objectMapper.readTree(liveMatchesJson);
            JsonNode typeMatches = rootNode.path("typeMatches");
            
            JsonNode targetMatchNode = null;

            for (JsonNode matchTypeNode : typeMatches) {
                if ("League".equalsIgnoreCase(matchTypeNode.path("matchType").asText())) {
                    for (JsonNode seriesMatch : matchTypeNode.path("seriesMatches")) {
                        JsonNode seriesAdWrapper = seriesMatch.path("seriesAdWrapper");
                        if (seriesAdWrapper.has("adDetail")) {
                            continue;
                        }
                        if (seriesAdWrapper.path("seriesName").asText().contains("Delhi Premier League 2025")) {
                            JsonNode matches = seriesAdWrapper.path("matches");
                            if (matches.isArray() && matches.size() > 0) {
                                targetMatchNode = matches.get(0).path("matchInfo");
                                break;
                            }
                        }
                    }
                }
                if (targetMatchNode != null) break;
            }

            if (targetMatchNode != null) {
                Map<String, Object> liveScoreData = new HashMap<>();
                
                String matchStatus = targetMatchNode.path("status").asText();
                
                liveScoreData.put("matchDesc", targetMatchNode.path("matchDesc").asText());
                liveScoreData.put("status", matchStatus);
                
                if ("Delay".equalsIgnoreCase(targetMatchNode.path("state").asText())) {
                    liveScoreData.put("stateTitle", targetMatchNode.path("stateTitle").asText());
                }

                JsonNode matchScoreNode = targetMatchNode.path("matchScore");
                if (!matchScoreNode.isMissingNode()) {
                    JsonNode team1ScoreNode = matchScoreNode.path("team1Score").path("inngs1");
                    liveScoreData.put("team1Name", targetMatchNode.path("team1").path("teamName").asText());
                    if (!team1ScoreNode.isMissingNode()) {
                        liveScoreData.put("team1Runs", team1ScoreNode.path("runs").asInt());
                        liveScoreData.put("team1Wickets", team1ScoreNode.path("wickets").asInt());
                        liveScoreData.put("team1Overs", team1ScoreNode.path("overs").asDouble());
                    }

                    JsonNode team2ScoreNode = matchScoreNode.path("team2Score").path("inngs1");
                    liveScoreData.put("team2Name", targetMatchNode.path("team2").path("teamName").asText());
                    if (!team2ScoreNode.isMissingNode()) {
                        liveScoreData.put("team2Runs", team2ScoreNode.path("runs").asInt());
                        liveScoreData.put("team2Wickets", team2ScoreNode.path("wickets").asInt());
                        liveScoreData.put("team2Overs", team2ScoreNode.path("overs").asDouble());
                    }
                }

                return liveScoreData;
            } else {
                System.out.println("No live Delhi Premier League 2025 match found.");
                return Collections.emptyMap();
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch live score data from API: " + e.getMessage());
            return Collections.emptyMap();
        }
    }
}