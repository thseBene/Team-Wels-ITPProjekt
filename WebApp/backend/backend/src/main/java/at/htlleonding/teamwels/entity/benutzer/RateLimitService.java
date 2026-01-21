package at.htlleonding.teamwels.entity.benutzer;

import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.time.Instant;
import java. util.concurrent.ConcurrentHashMap;
import java.util. concurrent.ConcurrentMap;

/**
 * Einfacher In-Memory Rate Limiter
 * Achtung: Funktioniert nur bei einer Instanz (nicht bei horizontaler Skalierung)
 */
@ApplicationScoped
public class RateLimitService {

    // Speichert IP -> Liste von Anfrage-Zeitpunkten
    private final ConcurrentMap<String, RequestCounter> requestCounters = new ConcurrentHashMap<>();

    /**
     * Prüft ob Rate Limit überschritten wurde
     * @param identifier Eindeutige ID (z.B. IP-Adresse oder E-Mail)
     * @param maxRequests Maximale Anzahl Anfragen
     * @param windowDuration Zeitfenster
     * @return true wenn Limit überschritten
     */
    public boolean isRateLimited(String identifier, int maxRequests, Duration windowDuration) {
        RequestCounter counter = requestCounters.computeIfAbsent(identifier, k -> new RequestCounter());

        Instant now = Instant.now();
        Instant windowStart = now.minus(windowDuration);

        // Alte Einträge entfernen
        counter.timestamps.removeIf(timestamp -> timestamp.isBefore(windowStart));

        // Prüfen ob Limit erreicht
        if (counter.timestamps.size() >= maxRequests) {
            return true; // Rate limit überschritten
        }

        // Neue Anfrage hinzufügen
        counter.timestamps.add(now);
        return false;
    }

    /**
     * Gibt verbleibende Anfragen zurück
     */
    public int getRemainingRequests(String identifier, int maxRequests, Duration windowDuration) {
        RequestCounter counter = requestCounters. get(identifier);
        if (counter == null) {
            return maxRequests;
        }

        Instant windowStart = Instant.now().minus(windowDuration);
        long validRequests = counter.timestamps.stream()
                .filter(timestamp -> timestamp.isAfter(windowStart))
                .count();

        return Math.max(0, maxRequests - (int) validRequests);
    }

    /**
     * Leert alte Einträge (Cleanup-Job, optional)
     */
    public void cleanup() {
        Instant cutoff = Instant.now().minus(Duration.ofHours(24));
        requestCounters.entrySet().removeIf(entry -> {
            entry.getValue().timestamps.removeIf(timestamp -> timestamp.isBefore(cutoff));
            return entry.getValue().timestamps.isEmpty();
        });
    }

    private static class RequestCounter {
        final java.util.List<Instant> timestamps = new java.util.concurrent.CopyOnWriteArrayList<>();
    }
}