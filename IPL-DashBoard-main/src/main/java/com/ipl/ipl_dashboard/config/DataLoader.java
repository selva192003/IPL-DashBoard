package com.ipl.ipl_dashboard.config;

import com.ipl.ipl_dashboard.data.MatchInput;
import com.ipl.ipl_dashboard.data.MatchProcessor;
import com.ipl.ipl_dashboard.model.Match;
import com.ipl.ipl_dashboard.model.Player;
import com.ipl.ipl_dashboard.model.Team;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import com.ipl.ipl_dashboard.repository.PlayerRepository;
import com.ipl.ipl_dashboard.repository.TeamRepository;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.InputStreamReader;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final MatchRepository matchRepo;
    private final TeamRepository teamRepo;
    private final PlayerRepository playerRepo; // Inject PlayerRepository

    @Override
    public void run(String... args) throws Exception {
        Map<String, Team> teamMap = new HashMap<>();
        Map<String, Player> playerMap = new HashMap<>();
        List<Match> matches = new ArrayList<>();

        try (CSVReader csvReader = new CSVReaderBuilder(new InputStreamReader(
                getClass().getResourceAsStream("/match-data.csv"))).withSkipLines(1).build()) {

            String[] columns;
            while ((columns = csvReader.readNext()) != null) {
                MatchInput input = new MatchInput();

                // Assign values from CSV columns to MatchInput fields
                input.setId(columns[0]);
                input.setSeason(columns[1]);
                input.setCity(columns[2]);
                input.setDate(columns[3]);
                input.setMatch_type(columns[4]);
                input.setPlayer_of_match(columns[5]);
                input.setVenue(columns[6]);

                input.setTeam1(normalizeTeamName(columns[7]));
                input.setTeam2(normalizeTeamName(columns[8]));
                input.setToss_winner(normalizeTeamName(columns[9]));

                input.setToss_decision(columns[10]);
                input.setWinner(normalizeTeamName(columns[11]));
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

                // Track matches and wins per team (existing logic)
                if (match.getTeam1() != null) {
                    teamMap.putIfAbsent(match.getTeam1(), new Team(match.getTeam1(), 0, 0, null));
                    teamMap.get(match.getTeam1()).setTotalMatches(teamMap.get(match.getTeam1()).getTotalMatches() + 1);
                }

                if (match.getTeam2() != null) {
                    teamMap.putIfAbsent(match.getTeam2(), new Team(match.getTeam2(), 0, 0, null));
                    teamMap.get(match.getTeam2()).setTotalMatches(teamMap.get(match.getTeam2()).getTotalMatches() + 1);
                }

                if (match.getMatchWinner() != null && !match.getMatchWinner().isBlank()) {
                    teamMap.putIfAbsent(match.getMatchWinner(), new Team(match.getMatchWinner(), 0, 0, null));
                    teamMap.get(match.getMatchWinner()).setTotalWins(teamMap.get(match.getMatchWinner()).getTotalWins() + 1);
                }

                // New: Track Player of the Match awards
                String playerOfMatchName = input.getPlayer_of_match(); // Use getter from MatchInput
                if (playerOfMatchName != null && !playerOfMatchName.isBlank() && !playerOfMatchName.equalsIgnoreCase("NA")) {
                    // Use the correct constructor for Player
                    playerMap.putIfAbsent(playerOfMatchName, new Player(playerOfMatchName, 0));
                    // Use the correct getter for totalPlayerOfMatchAwards
                    playerMap.get(playerOfMatchName).setTotalPlayerOfMatchAwards(
                        playerMap.get(playerOfMatchName).getTotalPlayerOfMatchAwards() + 1
                    );
                }
            }
        }

        matchRepo.saveAll(matches);
        teamRepo.saveAll(teamMap.values());
        playerRepo.saveAll(playerMap.values());

        System.out.println("✅ Matches saved: " + matches.size());
        System.out.println("✅ Teams saved: " + teamMap.size());
        System.out.println("✅ Players saved: " + playerMap.size());
    }

    // Existing helper method
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
