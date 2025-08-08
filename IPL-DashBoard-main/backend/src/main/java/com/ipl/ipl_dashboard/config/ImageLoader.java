package com.ipl.ipl_dashboard.config;

import com.ipl.ipl_dashboard.data.ImageScrapingService;
import com.ipl.ipl_dashboard.data.MatchInput;
import com.ipl.ipl_dashboard.data.MatchProcessor;
import com.ipl.ipl_dashboard.model.ImageResource;
import com.ipl.ipl_dashboard.model.Match; // NEW: Import the Match model
import com.ipl.ipl_dashboard.model.Player;
import com.ipl.ipl_dashboard.model.Team;
import com.ipl.ipl_dashboard.repository.ImageResourceRepository;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import com.ipl.ipl_dashboard.repository.PlayerRepository;
import com.ipl.ipl_dashboard.repository.TeamRepository;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.util.*;

@Component
@RequiredArgsConstructor
@Order(3) // Run this after DataLoader
public class ImageLoader implements CommandLineRunner {

    private final MatchRepository matchRepo;
    private final TeamRepository teamRepo;
    private final PlayerRepository playerRepo;
    private final ImageResourceRepository imageResourceRepo; // Inject ImageResourceRepository
    private final ImageScrapingService imageScrapingService; // Inject the new service

    @Override
    public void run(String... args) throws Exception {
        if (imageResourceRepo.count() == 0) { // Only load if the table is empty
            Map<String, Team> teamMap = new HashMap<>();
            Map<String, Player> playerMap = new HashMap<>();
            List<Match> matches = new ArrayList<>();
            List<ImageResource> imageResources = new ArrayList<>();

            try (CSVReader csvReader = new CSVReaderBuilder(new InputStreamReader(
                    getClass().getResourceAsStream("/match-data.csv"))).withSkipLines(1).build()) {

                String[] columns;
                while ((columns = csvReader.readNext()) != null) {
                    MatchInput input = new MatchInput();

                    input.setId(columns[0]);
                    input.setSeason(columns[1]);
                    input.setCity(columns[2]);
                    input.setDate(columns[3]);
                    input.setMatch_type(columns[4]);
                    input.setPlayer_of_match(columns[5]);
                    input.setVenue(columns[6]);

                    input.setTeam1(columns[7]);
                    input.setTeam2(columns[8]);
                    input.setToss_winner(columns[9]);

                    input.setToss_decision(columns[10]);
                    input.setWinner(columns[11]);
                    input.setResult(columns[12]);
                    input.setResult_margin(columns[13]);
                    input.setTarget_runs(columns[14]);
                    input.setTarget_overs(columns[15]);
                    input.setSuper_over(columns[16]);
                    input.setMethod(columns[17]);
                    input.setUmpire1(columns[18]);
                    input.setUmpire2(columns[19]);

                    Match match = MatchProcessor.process(input);
                    matches.add(match);

                    String team1Name = normalizeTeamName(match.getTeam1());
                    String team2Name = normalizeTeamName(match.getTeam2());
                    String matchWinnerName = normalizeTeamName(match.getMatchWinner());

                    if (team1Name != null) {
                        teamMap.putIfAbsent(team1Name, new Team(team1Name, 0, 0, null));
                        teamMap.get(team1Name).setTotalMatches(teamMap.get(team1Name).getTotalMatches() + 1);
                        
                        // Scrape and save team logo
                        if (imageResourceRepo.findByNameIgnoreCaseAndType(team1Name, "team").isEmpty()) {
                            String imageUrl = imageScrapingService.scrapeImageUrl(team1Name + " IPL logo");
                            imageResources.add(new ImageResource(null, team1Name, "team", imageUrl));
                        }
                    }

                    if (team2Name != null) {
                        teamMap.putIfAbsent(team2Name, new Team(team2Name, 0, 0, null));
                        teamMap.get(team2Name).setTotalMatches(teamMap.get(team2Name).getTotalMatches() + 1);

                        // Scrape and save team logo
                         if (imageResourceRepo.findByNameIgnoreCaseAndType(team2Name, "team").isEmpty()) {
                            String imageUrl = imageScrapingService.scrapeImageUrl(team2Name + " IPL logo");
                            imageResources.add(new ImageResource(null, team2Name, "team", imageUrl));
                        }
                    }

                    if (matchWinnerName != null && !matchWinnerName.isBlank()) {
                        teamMap.putIfAbsent(matchWinnerName, new Team(matchWinnerName, 0, 0, null));
                        teamMap.get(matchWinnerName).setTotalWins(teamMap.get(matchWinnerName).getTotalWins() + 1);
                    }

                    String playerOfMatchName = input.getPlayer_of_match();
                    if (playerOfMatchName != null && !playerOfMatchName.isBlank() && !playerOfMatchName.equalsIgnoreCase("NA")) {
                        playerMap.putIfAbsent(playerOfMatchName, new Player(playerOfMatchName, 0));
                        playerMap.get(playerOfMatchName).setTotalPlayerOfMatchAwards(
                            playerMap.get(playerOfMatchName).getTotalPlayerOfMatchAwards() + 1
                        );

                        // Scrape and save player image
                        if (imageResourceRepo.findByNameIgnoreCaseAndType(playerOfMatchName, "player").isEmpty()) {
                            String imageUrl = imageScrapingService.scrapeImageUrl(playerOfMatchName + " cricket player photo");
                            imageResources.add(new ImageResource(null, playerOfMatchName, "player", imageUrl));
                        }
                    }
                }
            }

            matchRepo.saveAll(matches);
            teamRepo.saveAll(teamMap.values());
            playerRepo.saveAll(playerMap.values());
            imageResourceRepo.saveAll(imageResources);

            System.out.println("✅ Matches saved: " + matches.size());
            System.out.println("✅ Teams saved: " + teamMap.size());
            System.out.println("✅ Players saved: " + playerMap.size());
            System.out.println("✅ Scraped images saved: " + imageResources.size());
        }
    }

    private String normalizeTeamName(String name) {
        if (name == null || name.trim().equalsIgnoreCase("NA") || name.isBlank()) return null;

        return switch (name.trim()) {
            case "Rising Pune Supergiant", "Rising Pune Supergiants" -> "Rising Pune Supergiants";
            case "Delhi Daredevils", "Delhi Capitals" -> "Delhi Capitals";
            case "Kings XI Punjab", "Punjab Kings" -> "Punjab Kings";
            case "Royal Challengers Bengaluru", "Royal Challengers Bangalore" -> "Royal Challengers Bangalore";
            default -> name.trim();
        };
    }
}
