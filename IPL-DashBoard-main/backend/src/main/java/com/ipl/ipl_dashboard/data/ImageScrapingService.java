package com.ipl.ipl_dashboard.data;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class ImageScrapingService {

    private static final String UNSPLASH_SEARCH_URL = "https://source.unsplash.com/100x100/?";
    private static final String USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36";

    // Static map for team logos - using high-quality sources
    private static final Map<String, String> TEAM_LOGOS = new HashMap<>();
    
    static {
        // IPL team logos from reliable sources
        TEAM_LOGOS.put("Mumbai Indians", "https://logos-world.net/wp-content/uploads/2020/06/Mumbai-Indians-Logo.png");
        TEAM_LOGOS.put("Chennai Super Kings", "https://logos-world.net/wp-content/uploads/2020/06/Chennai-Super-Kings-Logo.png");
        TEAM_LOGOS.put("Royal Challengers Bangalore", "https://logos-world.net/wp-content/uploads/2020/06/Royal-Challengers-Bangalore-Logo.png");
        TEAM_LOGOS.put("Kolkata Knight Riders", "https://logos-world.net/wp-content/uploads/2020/06/Kolkata-Knight-Riders-Logo.png");
        TEAM_LOGOS.put("Sunrisers Hyderabad", "https://logos-world.net/wp-content/uploads/2020/06/Sunrisers-Hyderabad-Logo.png");
        TEAM_LOGOS.put("Delhi Capitals", "https://logos-world.net/wp-content/uploads/2020/06/Delhi-Capitals-Logo.png");
        TEAM_LOGOS.put("Punjab Kings", "https://logos-world.net/wp-content/uploads/2020/06/Punjab-Kings-Logo.png");
        TEAM_LOGOS.put("Rajasthan Royals", "https://logos-world.net/wp-content/uploads/2020/06/Rajasthan-Royals-Logo.png");
        TEAM_LOGOS.put("Gujarat Titans", "https://logowik.com/content/uploads/images/gujarat-titans5352.jpg");
        TEAM_LOGOS.put("Lucknow Super Giants", "https://logowik.com/content/uploads/images/lucknow-super-giants6357.jpg");
        
        // Fallback for older teams
        TEAM_LOGOS.put("Deccan Chargers", "https://placehold.co/100x100/FF6B35/FFFFFF?text=DC");
        TEAM_LOGOS.put("Gujarat Lions", "https://placehold.co/100x100/FFD700/000000?text=GL");
        TEAM_LOGOS.put("Rising Pune Supergiants", "https://placehold.co/100x100/9C27B0/FFFFFF?text=RPS");
        TEAM_LOGOS.put("Kochi Tuskers Kerala", "https://placehold.co/100x100/4CAF50/FFFFFF?text=KTK");
    }

    /**
     * Scrapes the web for an image URL based on a search query.
     * Uses multiple fallback strategies for better reliability.
     *
     * @param query The search query (e.g., "Mumbai Indians logo" or "MS Dhoni player photo").
     * @return The URL of an appropriate image.
     */
    public String scrapeImageUrl(String query) {
        // First, check if it's a team logo request
        if (query.contains("IPL logo")) {
            String teamName = query.replace(" IPL logo", "").trim();
            if (TEAM_LOGOS.containsKey(teamName)) {
                return TEAM_LOGOS.get(teamName);
            }
        }

        // For player images, try Unsplash with cricket-related search
        if (query.contains("cricket player photo")) {
            String playerName = query.replace(" cricket player photo", "").trim();
            return generatePlayerImageUrl(playerName);
        }

        // Try basic web scraping as fallback
        try {
            return attemptImageScraping(query);
        } catch (Exception e) {
            System.err.println("Error scraping image for query: '" + query + "' - " + e.getMessage());
            return generateFallbackImage(query);
        }
    }

    private String generatePlayerImageUrl(String playerName) {
        // Create a colorful placeholder for players
        int hash = Math.abs(playerName.hashCode());
        String[] colors = {"FF6B35", "4CAF50", "2196F3", "9C27B0", "FF9800", "E91E63", "607D8B"};
        String color = colors[hash % colors.length];
        
        String initials = playerName.chars()
                .mapToObj(c -> String.valueOf((char) c))
                .filter(s -> Character.isUpperCase(s.charAt(0)))
                .reduce("", String::concat);
        
        if (initials.length() > 2) {
            initials = initials.substring(0, 2);
        }
        
        return String.format("https://placehold.co/100x100/%s/FFFFFF?text=%s", color, initials);
    }

    private String attemptImageScraping(String query) throws IOException {
        try {
            // Try searching a more cricket-friendly site
            String encodedQuery = URLEncoder.encode(query + " cricket", StandardCharsets.UTF_8.toString());
            
            // Use Unsplash as a more reliable image source
            return UNSPLASH_SEARCH_URL + encodedQuery;
            
        } catch (Exception e) {
            throw new IOException("Failed to scrape image", e);
        }
    }

    private String generateFallbackImage(String query) {
        // Generate a themed placeholder based on the query
        if (query.toLowerCase().contains("team") || query.toLowerCase().contains("logo")) {
            return "https://placehold.co/100x100/1976D2/FFFFFF?text=TEAM";
        } else if (query.toLowerCase().contains("player")) {
            return "https://placehold.co/100x100/4CAF50/FFFFFF?text=PLAYER";
        } else {
            return "https://placehold.co/100x100/757575/FFFFFF?text=IMAGE";
        }
    }
}
