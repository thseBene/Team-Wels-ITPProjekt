package at.htlleonding.teamwels.entity.feedback;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import at.htlleonding.teamwels.entity.benutzer.BenutzerRepository;
import at.htlleonding.teamwels.entity.kategorie.KategorieEntity;
import at.htlleonding.teamwels.entity.kategorie.KategorieRepository;
import at.htlleonding.teamwels.entity.thema.ThemaEntity;
import at.htlleonding.teamwels.entity.thema.ThemaRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.NotFoundException;

import java.time.Instant;
import java.util.List;

/**
 * Service-Layer für Feedback Business-Logik
 * Kapselt alle Geschäftsregeln und Datenbank-Operationen
 */
@ApplicationScoped
public class FeedbackService {

    @Inject
    FeedbackRepository feedbackRepo;

    @Inject
    BenutzerRepository benutzerRepo;

    @Inject
    ThemaRepository themaRepo;

    // StatusRepository entfernt (nicht mehr benötigt)
    @Inject
    KategorieRepository kategorieRepo;

    /**
     * Erstellt ein neues Feedback basierend auf dem Payload
     */
    @Transactional
    public FeedbackEntity createFeedback(FeedbackPayload payload) {
        validatePayload(payload);

        FeedbackEntity feedback = new FeedbackEntity();
        mapPayloadToEntity(payload, feedback);

        Instant now = Instant.now();
        feedback.createdAt = now;
        feedback.updatedAt = now;

        feedbackRepo.persist(feedback);
        return feedback;
    }

    /**
     * Aktualisiert ein bestehendes Feedback
     */
    @Transactional
    public FeedbackEntity updateFeedback(Long id, FeedbackPayload payload) {
        FeedbackEntity existing = feedbackRepo.findById(id);
        if (existing == null) {
            throw new NotFoundException("Feedback mit ID " + id + " nicht gefunden");
        }

        validatePayload(payload);
        mapPayloadToEntity(payload, existing);
        existing.updatedAt = Instant.now();

        return existing; // Automatisch gemergt durch JPA
    }

    /**
     * Ändert nur den Status eines Feedbacks
     */
    @Transactional
    public FeedbackEntity updateStatus(Long feedbackId, String statusValue) {
        FeedbackEntity feedback = feedbackRepo.findById(feedbackId);
        if (feedback == null) {
            throw new NotFoundException("Feedback mit ID " + feedbackId + " nicht gefunden");
        }

        try {
            feedback.status = Status.from(statusValue);
        } catch (IllegalArgumentException e) {
            throw new NotFoundException("Ungültiger Status: " + statusValue);
        }

        feedback.updatedAt = Instant.now();

        return feedback;
    }

    /**
     * Löscht ein Feedback
     */
    @Transactional
    public void deleteFeedback(Long id) {
        boolean deleted = feedbackRepo.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("Feedback mit ID " + id + " nicht gefunden");
        }
    }

    /**
     * Gibt alle Feedbacks zurück
     */
    public List<FeedbackEntity> getAllFeedbacks() {
        return feedbackRepo.listAll();
    }

    /**
     * Gibt ein einzelnes Feedback zurück
     */
    public FeedbackEntity getFeedback(Long id) {
        FeedbackEntity feedback = feedbackRepo.findById(id);
        if (feedback == null) {
            throw new NotFoundException("Feedback mit ID " + id + " nicht gefunden");
        }
        return feedback;
    }

    // --- Private Hilfsmethoden ---

    private void validatePayload(FeedbackPayload payload) {
        if (payload == null) {
            throw new BadRequestException("Payload darf nicht leer sein");
        }

        if (payload.subject != null && payload.subject.trim().isEmpty()) {
            throw new BadRequestException("Betreff darf nicht leer sein");
        }

        if (payload.description != null && payload.description.trim().isEmpty()) {
            throw new BadRequestException("Beschreibung darf nicht leer sein");
        }
    }

    private void mapPayloadToEntity(FeedbackPayload payload, FeedbackEntity entity) {
        if (payload.subject != null) {
            entity.subject = payload.subject.trim();
        }

        if (payload.description != null) {
            entity.description = payload.description.trim();
        }

        if (payload.type != null) {
            entity.type = payload.type;
        }

        // Neu: status als String/Enum
        if (payload.status != null) {
            try {
                entity.status = Status.from(payload.status);
            } catch (IllegalArgumentException e) {
                throw new NotFoundException("Ungültiger Status: " + payload.status);
            }
        }

        // Benutzer-Beziehung
        if (payload.userId != null) {
            BenutzerEntity user = benutzerRepo.findById(payload.userId);
            if (user == null) {
                throw new NotFoundException("Benutzer mit ID " + payload.userId + " nicht gefunden");
            }
            entity.user = user;
        }

        // Thema-Beziehung
        if (payload.themaId != null) {
            ThemaEntity thema = themaRepo.findById(payload.themaId);
            if (thema == null) {
                throw new NotFoundException("Thema mit ID " + payload.themaId + " nicht gefunden");
            }
            entity.thema = thema;
        }

        // Kategorien (ManyToMany)
        if (payload.kategorieIds != null && !payload.kategorieIds.isEmpty()) {
            entity.kategorien.clear();
            for (Long kategorieId : payload.kategorieIds) {
                KategorieEntity kategorie = kategorieRepo.findById(kategorieId);
                if (kategorie == null) {
                    throw new NotFoundException("Kategorie mit ID " + kategorieId + " nicht gefunden");
                }
                entity.kategorien.add(kategorie);
            }
        }
    }

    // --- DTOs (können auch in eigene Klasse ausgelagert werden) ---

    public static class FeedbackPayload {
        public String subject;
        public String description;
        public String type;
        // statt statusId verwenden wir status-String (Enum-Name oder Label)
        public String status;
        public Long userId;
        public Long themaId;
        public List<Long> kategorieIds;
        public List<BildPayload> bilder;
    }

    public static class BildPayload {
        public String bildpfad;
        public String beschreibung;
    }
}