package at.htlleonding.teamwels.entity.feedback.services;

import at.htlleonding.teamwels.entity.activitylog.ActivityLogService;
import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import at.htlleonding.teamwels.entity.benutzer.BenutzerRepository;
import at.htlleonding.teamwels.entity.feedback.FeedbackEntity;
import at.htlleonding.teamwels.entity.feedback.FeedbackRepository;
import at.htlleonding.teamwels.entity.feedback.Status;
import at.htlleonding.teamwels.entity.notification.NotificationEntity;
import at.htlleonding.teamwels.entity.notification.NotificationService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.ForbiddenException;
import jakarta.ws.rs.NotFoundException;
import org.eclipse.microprofile.context.ManagedExecutor;

import java.time.Instant;
import java.util.List;

/**
 * Service-Layer für Feedback Business-Logik
 * Anmerkung: Die Beziehungen zu Thema und Kategorie werden vorerst nicht gemappt,
 * um Lazy-Loading Probleme zu vermeiden.
 */
@ApplicationScoped
public class FeedbackService {

    @Inject
    FeedbackRepository feedbackRepo;

    @Inject
    BenutzerRepository benutzerRepo;

    @Inject
    SmsService smsService;

    @Inject
    EmailService emailService;

    @Inject
    ActivityLogService activityLogService;

    @Inject
    ManagedExecutor executor;

    // ThemaRepository und KategorieRepository werden derzeit nicht verwendet
    // (falls in Projekt noch referenziert, bitte entfernen/kommentieren)
    // @Inject
    // ThemaRepository themaRepo;
    // @Inject
    // KategorieRepository kategorieRepo;
    @Inject
    NotificationService notificationService;

    /**
     * Erstellt ein neues Feedback basierend auf dem Payload
     * Hinweis: Thema/Kategorien werden aktuell nicht verknüpft.
     */
    @Transactional
    public FeedbackEntity createFeedback(FeedbackPayload payload) {
        FeedbackEntity feedback  = new FeedbackEntity();
        mapPayloadToEntity(payload, feedback);
        // Prüfen ob User bereits Feedbacks hat
        long feedbackCount = FeedbackEntity.count("user.id", feedback.user.id);

        // Ab dem 2. Feedback: Verifizierung erforderlich
        if (feedbackCount > 0 && !feedback.user.isFullyVerified()) {
            throw new ForbiddenException(
                    "Bitte verifizieren Sie zuerst Ihre Kontaktdaten."
            );
        }
        // Feedback erstellen

        feedbackRepo.persist(feedback);

        // Notification erstellen (wird sofort gesendet wenn verifiziert, sonst pending)
        notificationService.createFeedbackNotification(feedback);
        activityLogService.logFeedbackCreated(feedback.id, feedback.subject, feedback.user.id);

        return feedback;
    }

    /**
     * Aktualisiert ein bestehendes Feedback
     * Hinweis: Thema/Kategorien werden aktuell nicht verknüpft.
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
        Status oldStatus = feedback.status;
        try {
            feedback.status = Status.from(statusValue);
        } catch (IllegalArgumentException e) {
            throw new NotFoundException("Ungültiger Status: " + statusValue);
        }



        feedback.updatedAt = Instant.now();

        // Benachrichtigung erstellen, wenn Status sich geändert hat
        // (Alten Status wird nicht benötigt, für einfache Implementation hier weggelassen)
        if (feedback.user != null) {

            try {
                if (feedback.user.mail != null){
                    emailService.sendEmailUpdatedStatus(feedback, oldStatus);
                }
                if (feedback.user.tel != null){
                    String body = String.format("Ihr Feedback '%s' hat eine Statusänderung erhalten:\n" +
                                    "Alter Status: %s → Neuer Status: %s\n\n" +
                                    "Mit freundlichen Grüßen\n" +
                                    "Ihr Team Wels",
                            feedback.subject, oldStatus, feedback.status);
                    //smsService.sendSms(feedback.user.tel, body);
                }
            }
            catch (Exception e) {
                throw new RuntimeException("Fehler beim Versenden der E-Mail",e);
            }
        }
       // activityLogService.logFeedbackStatusChanged(feedback.user != null ? feedback.user.id : null, feedback.id, feedback.subject, oldStatus != null ? oldStatus.getLabel() : "unbekannt", feedback.status.getLabel());
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

        // Benutzer-Beziehung bleibt erhalten
        if (payload.userId != null) {
            BenutzerEntity user = benutzerRepo.findById(payload.userId);
            if (user == null) {
                throw new NotFoundException("Benutzer mit ID " + payload.userId + " nicht gefunden");
            }
            entity.user = user;
        }

        // Hinweis: Thema- und Kategorie-Verarbeitung entfernt, um Lazy-Loading-Fehler zu vermeiden.
    }
    // --- DTOs (angepasst: thema/kategorien entfernt) ---
    public static class FeedbackPayload {
        public String subject;
        public String description;
        public String type;
        // statt statusId verwenden wir status-String (Enum-Name oder Label)
        public String status;
        public Long userId;
        // themaId und kategorieIds entfernt, weil Verknüpfungen aktuell nicht benötigt werden
        public List<BildPayload> bilder;
    }

    public static class BildPayload {
        public String bildpfad;
        public String beschreibung;
    }
}