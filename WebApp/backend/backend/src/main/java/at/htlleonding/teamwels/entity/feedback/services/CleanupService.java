package at.htlleonding.teamwels.entity.feedback.services;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import at.htlleonding.teamwels.entity.benutzer.BenutzerRepository;
import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

@ApplicationScoped
public class CleanupService {

    @Inject
    BenutzerRepository repo;

    // Jeden Tag um 2 Uhr morgens ausführen
    @Scheduled(cron = "0 0 2 * * ? ")
    @Transactional
    void deleteUnverifiedUsers() {
        // Lösche unverifizierte Accounts älter als 7 Tage
        LocalDateTime cutoff = LocalDateTime.now().minusDays(7);

        long deleted = BenutzerEntity.delete(
                "emailVerified = false AND telVerified = false AND id IN " +
                        "(SELECT id FROM benutzer WHERE email_verification_token_created_at < ?1 " +
                        "OR tel_verification_code_created_at < ?1)",
                cutoff
        );

        System.out.println("Gelöscht: " + deleted + " unverifizierte Accounts");
    }
}