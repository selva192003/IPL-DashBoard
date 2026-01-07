package com.ipl.ipl_dashboard.service;

import com.ipl.ipl_dashboard.dto.IconicMatchDto;
import com.ipl.ipl_dashboard.model.Match;
import com.ipl.ipl_dashboard.repository.MatchRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class IconicMatchService {
    private final MatchRepository matchRepository;
    private final Random random = new Random();
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd MMM yyyy", Locale.ENGLISH);

    public IconicMatchService(MatchRepository matchRepository) {
        this.matchRepository = matchRepository;
    }

    public IconicMatchDto pickRandomIconicMatch() {
        // Load a reasonable chunk to avoid heavy memory usage
        Page<Match> page = matchRepository.findAll(PageRequest.of(0, 2000));
        List<Match> all = page.getContent();
        if (all.isEmpty()) return null;

        // Filter for legendary/iconic matches using available signals
        List<Match> candidates = all.stream()
                .filter(this::isIconic)
                .collect(Collectors.toCollection(ArrayList::new));

        if (candidates.isEmpty()) {
            // Fallback: choose a random recent match
            return toDto(all.get(random.nextInt(all.size())), "Featured memorable IPL clash");
        }

        Match picked = candidates.get(random.nextInt(candidates.size()));
        String why = buildSignificance(picked);
        return toDto(picked, why);
    }

    private boolean isIconic(Match m) {
        String type = safe(m.getMatchType());
        String method = safe(m.getMethod());
        String superOver = safe(m.getSuperOver());
        String result = safe(m.getResult());
        String margin = safe(m.getResultMargin());

        boolean finalStage = contains(type, "final") || contains(type, "qualifier") || contains(type, "eliminator");
        boolean wentSuperOver = contains(superOver, "yes") || contains(method, "super");
        boolean nailBiter = isCloseFinish(result, margin);

        // With limited fields, treat any of these signals as iconic
        return finalStage || wentSuperOver || nailBiter;
    }

    private boolean isCloseFinish(String result, String marginStr) {
        // margin stored as string; parse number if possible
        int margin = parseIntSafe(marginStr);
        if (margin <= 0) return false;
        if (contains(result, "wicket")) {
            return margin <= 2; // won by <= 2 wickets
        }
        if (contains(result, "run")) {
            return margin <= 5; // won by <= 5 runs
        }
        return false;
    }

    private IconicMatchDto toDto(Match m, String significance) {
        IconicMatchDto dto = new IconicMatchDto();
        dto.setSeason(m.getSeason());
        dto.setTeam1(m.getTeam1());
        dto.setTeam2(m.getTeam2());
        dto.setVenue(m.getVenue());
        dto.setDate(m.getDate() != null ? m.getDate().format(DATE_FMT) : null);
        dto.setMatchWinner(m.getMatchWinner());
        dto.setResultMargin(m.getResultMargin());
        dto.setResult(m.getResult());
        dto.setSignificance(significance);
        dto.setMatchType(m.getMatchType());
        dto.setMethod(m.getMethod());
        dto.setSuperOver(m.getSuperOver());

        // Optional scoreboard fields are not available from current dataset; leave null
        return dto;
    }

    private String buildSignificance(Match m) {
        String type = safe(m.getMatchType());
        String method = safe(m.getMethod());
        String superOver = safe(m.getSuperOver());
        String result = safe(m.getResult());
        String margin = safe(m.getResultMargin());

        if (contains(type, "final")) return "Grand Finale showdown on the big stage";
        if (contains(type, "qualifier")) return "High-stakes Qualifier clash";
        if (contains(type, "eliminator")) return "Do-or-die Eliminator classic";
        if (contains(superOver, "yes") || contains(method, "super")) return "Thrilling Super Over finish";

        if (contains(result, "wicket")) {
            int n = parseIntSafe(margin);
            if (n > 0) return "Nail-biting finish by " + n + " wickets";
            return "Nail-biting finish by wickets";
        }
        if (contains(result, "run")) {
            int n = parseIntSafe(margin);
            if (n > 0) return "Edge-of-seat defense by " + n + " runs";
            return "Edge-of-seat defense by runs";
        }
        return "Featured memorable IPL clash";
    }

    private static boolean contains(String s, String needle) {
        return s != null && s.toLowerCase(Locale.ENGLISH).contains(needle.toLowerCase(Locale.ENGLISH));
    }

    private static String safe(String s) { return s == null ? "" : s; }

    private static int parseIntSafe(String s) {
        try { return Integer.parseInt(s.trim()); } catch (Exception e) { return -1; }
    }
}
