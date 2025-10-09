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
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStreamReader;
import java.util.*;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final MatchRepository matchRepo;
    private final TeamRepository teamRepo;
    private final PlayerRepository playerRepo;

    @Override
    @Transactional
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

                // Normalize venue name
                input.setVenue(normalizeVenueName(columns[6]));

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

                // Track matches and wins per team
                if (match.getTeam1() != null) {
                    teamMap.putIfAbsent(match.getTeam1(), new Team(match.getTeam1(), 0, 0));
                    teamMap.get(match.getTeam1()).setTotalMatches(teamMap.get(match.getTeam1()).getTotalMatches() + 1);
                }

                if (match.getTeam2() != null) {
                    teamMap.putIfAbsent(match.getTeam2(), new Team(match.getTeam2(), 0, 0));
                    teamMap.get(match.getTeam2()).setTotalMatches(teamMap.get(match.getTeam2()).getTotalMatches() + 1);
                }

                if (match.getMatchWinner() != null && !match.getMatchWinner().isBlank()) {
                    teamMap.putIfAbsent(match.getMatchWinner(), new Team(match.getMatchWinner(), 0, 0));
                    teamMap.get(match.getMatchWinner()).setTotalWins(teamMap.get(match.getMatchWinner()).getTotalWins() + 1);
                }

                // New: Track Player of the Match awards
                String playerOfMatchName = input.getPlayer_of_match();
                if (playerOfMatchName != null && !playerOfMatchName.isBlank() && !playerOfMatchName.equalsIgnoreCase("NA")) {
                    playerMap.putIfAbsent(playerOfMatchName, new Player(playerOfMatchName, 0));
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

    private String normalizeVenueName(String name) {
        if (name == null || name.trim().equalsIgnoreCase("NA") || name.isBlank()) return null;

        return switch (name.trim()) {
            case "MA Chidambaram Stadium, Chepauk",
                 "MA Chidambaram Stadium",
                 "M. A. Chidambaram Stadium",
                 "MA Chidambaram Stadium, Chepauk, Chennai" -> "MA Chidambaram Stadium, Chennai";
            case "M. Chinnaswamy Stadium",
                 "M.Chinnaswamy Stadium",
                 "M Chinnaswamy Stadium, Bengaluru" -> "M Chinnaswamy Stadium, Bengaluru";
            case "Arun Jaitley Stadium",
                 "Feroz Shah Kotla",
                 "Feroz Shah Kotla Ground",
                 "Arun Jaitley Stadium, Delhi" -> "Arun Jaitley Stadium, Delhi";
            case "Wankhede Stadium",
                 "Wankhede Stadium, Mumbai" -> "Wankhede Stadium, Mumbai";
            case "Rajiv Gandhi International Cricket Stadium",
                 "Rajiv Gandhi International Stadium, Uppal",
                 "Rajiv Gandhi International Stadium",
                 "Rajiv Gandhi International Stadium, Uppal, Hyderabad" -> "Rajiv Gandhi International Stadium, Hyderabad";
            case "Sardar Patel Stadium, Motera",
                 "Sardar Vallabhai Patel Stadium",
                 "Narendra Modi Stadium, Ahmedabad" -> "Narendra Modi Stadium, Ahmedabad";
            case "Maharashtra Cricket Association Stadium",
                 "Maharashtra Cricket Association Stadium, Pune" -> "Maharashtra Cricket Association Stadium, Pune";
            case "Himachal Pradesh Cricket Association Stadium, Dharamsala",
                 "Himachal Pradesh Cricket Association Stadium" -> "HPCA Stadium, Dharamshala";
            case "JSCA International Stadium Complex" -> "JSCA International Stadium Complex, Ranchi";
            case "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium",
                 "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam",
                 "ACA-VDCA Stadium" -> "Dr. Y.S. Rajasekhara Reddy ACA-VDCA Cricket Stadium, Visakhapatnam";
            case "Punjab Cricket Association Stadium, Mohali",
                 "Punjab Cricket Association IS Bindra Stadium, Mohali",
                 "Punjab Cricket Association IS Bindra Stadium, Mohali, Chandigarh",
                 "Maharaja Yadavindra Singh International Cricket Stadium, Mullanpur" -> "Punjab Cricket Association Stadium, Mohali";
            case "Subrata Roy Sahara Stadium" -> "Subrata Roy Sahara Stadium, Pune";
            case "Saurashtra Cricket Association Stadium" -> "Saurashtra Cricket Association Stadium, Rajkot";
            case "Holkar Cricket Stadium" -> "Holkar Cricket Stadium, Indore";
            case "Sawai Mansingh Stadium" -> "Sawai Mansingh Stadium, Jaipur";
            case "Green Park" -> "Green Park, Kanpur";
            case "Eden Gardens",
                 "Eden Gardens, Kolkata" -> "Eden Gardens, Kolkata";
            case "Dr DY Patil Sports Academy",
                 "Dr DY Patil Sports Academy, Mumbai" -> "Dr DY Patil Sports Academy, Mumbai";
            case "Sheikh Zayed Stadium" -> "Sheikh Zayed Stadium, Abu Dhabi";
            case "Dubai International Cricket Stadium" -> "Dubai International Cricket Stadium, Dubai";
            case "Sharjah Cricket Stadium" -> "Sharjah Cricket Stadium, Sharjah";
            case "Newlands" -> "Newlands, Cape Town";
            case "St George's Park" -> "St George's Park, Port Elizabeth";
            case "Kingsmead" -> "Kingsmead, Durban";
            case "SuperSport Park" -> "SuperSport Park, Centurion";
            case "OUTsurance Oval" -> "OUTsurance Oval, Bloemfontein";
            case "New Wanderers Stadium" -> "New Wanderers Stadium, Johannesburg";
            case "Buffalo Park" -> "Buffalo Park, East London";
            case "De Beers Diamond Oval" -> "De Beers Diamond Oval, Kimberley";
            case "Bharat Ratna Shri Atal Bihari Vajpayee Ekana Cricket Stadium, Lucknow" -> "Ekana Cricket Stadium, Lucknow";
            case "Barsapara Cricket Stadium, Guwahati" -> "Barsapara Cricket Stadium, Guwahati";
            case "Shaheed Veer Narayan Singh International Stadium" -> "Shaheed Veer Narayan Singh International Stadium, Raipur";
            case "Zayed Cricket Stadium, Abu Dhabi" -> "Zayed Cricket Stadium, Abu Dhabi";
            case "Nehru Stadium" -> "Nehru Stadium, Kochi";
            case "Brabourne Stadium",
                 "Brabourne Stadium, Mumbai" -> "Brabourne Stadium, Mumbai";
            case "Vidarbha Cricket Association Stadium, Jamtha" -> "Vidarbha Cricket Association Stadium, Nagpur";
            case "Greenfield International Stadium" -> "Greenfield International Stadium, Thiruvananthapuram";
            default -> name.trim();
        };
    }
}
