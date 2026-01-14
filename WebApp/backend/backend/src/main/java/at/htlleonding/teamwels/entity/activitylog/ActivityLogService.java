package at.htlleonding.teamwels.entity.activitylog;

import at.htlleonding.teamwels.entity.mitarbeiter.MitarbeiterEntity;
import at.htlleonding.teamwels.entity. mitarbeiter.MitarbeiterRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs. NotFoundException;

import java.time. Instant;
import java.util.List;

@ApplicationScoped
public class ActivityLogService {

    @Inject
    ActivityLogRepository activityLogRepo;

    @Inject
    MitarbeiterRepository mitarbeiterRepo;

    /**
     * Loggt das Anschauen eines Feedbacks (GEÄNDERT)
     */
    @Transactional
    public void logFeedbackViewed(Long mitarbeiterId, Long feedbackId, String feedbackSubject) {
        MitarbeiterEntity mitarbeiter = getMitarbeiter(mitarbeiterId);

        ActivityLogEntity log = new ActivityLogEntity();
        log.actionType = ActionType.FEEDBACK_VIEWED;
        log.mitarbeiter = mitarbeiter;
        log.feedbackId = feedbackId;
        log.feedbackSubject = feedbackSubject;
        log. details = String.format("Mitarbeiter %s %s hat Feedback '%s' angeschaut",
                mitarbeiter.vorname, mitarbeiter.nachname, feedbackSubject);

        activityLogRepo.persist(log);
    }

    /**
     * Loggt eine Status-Änderung eines Feedbacks (GEÄNDERT)
     */
    @Transactional
    public void logFeedbackStatusChanged(Long mitarbeiterId, Long feedbackId,
                                         String feedbackSubject, String oldStatus, String newStatus) {
        ActivityLogEntity log = new ActivityLogEntity();
        log.actionType = ActionType.FEEDBACK_STATUS_CHANGED;

        // Mitarbeiter ist optional
        if (mitarbeiterId != null) {
            try {
                MitarbeiterEntity mitarbeiter = mitarbeiterRepo.findById(mitarbeiterId);
                if (mitarbeiter != null) {
                    log.mitarbeiter = mitarbeiter;
                    log.details = String.format("Mitarbeiter %s %s hat Status von '%s' auf '%s' geändert",
                            mitarbeiter.vorname, mitarbeiter.nachname, oldStatus, newStatus);
                } else {
                    log.details = String.format("Status wurde von '%s' auf '%s' geändert", oldStatus, newStatus);
                }
            } catch (Exception e) {
                log.details = String.format("Status wurde von '%s' auf '%s' geändert", oldStatus, newStatus);
            }
        } else {
            log.details = String.format("Status wurde von '%s' auf '%s' geändert", oldStatus, newStatus);
        }

        log.feedbackId = feedbackId;
        log.feedbackSubject = feedbackSubject;
        log.oldValue = oldStatus;
        log. newValue = newStatus;

        activityLogRepo.persist(log);
    }

    /**
     * Loggt das Erstellen eines neuen Feedbacks
     */
    @Transactional
    public void logFeedbackCreated(Long feedbackId, String feedbackSubject, Long userId) {
        ActivityLogEntity log = new ActivityLogEntity();
        log.actionType = ActionType.FEEDBACK_CREATED;
        log.feedbackId = feedbackId;
        log.feedbackSubject = feedbackSubject;
        log.details = String.format("Neues Feedback '%s' wurde erstellt (User-ID: %d)",
                feedbackSubject, userId);

        activityLogRepo.persist(log);
    }

    /**
     * Loggt das Versenden einer E-Mail-Benachrichtigung
     */
    @Transactional
    public void logNotificationEmailSent(Long feedbackId, String feedbackSubject,
                                         String recipient, String notificationReason) {
        ActivityLogEntity log = new ActivityLogEntity();
        log.actionType = ActionType.NOTIFICATION_EMAIL_SENT;
        log.feedbackId = feedbackId;
        log.feedbackSubject = feedbackSubject;
        log.details = String.format("E-Mail-Benachrichtigung an %s gesendet.  Grund: %s",
                recipient, notificationReason);
        log.newValue = recipient;

        activityLogRepo.persist(log);
    }

    /**
     * Loggt das Versenden einer SMS-Benachrichtigung
     */
    @Transactional
    public void logNotificationSmsSent(Long feedbackId, String feedbackSubject,
                                       String recipient, String notificationReason) {
        ActivityLogEntity log = new ActivityLogEntity();
        log.actionType = ActionType.NOTIFICATION_SMS_SENT;
        log.feedbackId = feedbackId;
        log.feedbackSubject = feedbackSubject;
        log.details = String.format("SMS-Benachrichtigung an %s gesendet. Grund: %s",
                recipient, notificationReason);
        log.newValue = recipient;

        activityLogRepo.persist(log);
    }

    /**
     * Loggt einen Mitarbeiter-Login (GEÄNDERT)
     */
    @Transactional
    public void logEmployeeLogin(Long mitarbeiterId) {
        MitarbeiterEntity mitarbeiter = getMitarbeiter(mitarbeiterId);

        ActivityLogEntity log = new ActivityLogEntity();
        log.actionType = ActionType.EMPLOYEE_LOGIN;
        log.mitarbeiter = mitarbeiter;
        log.details = String.format("Mitarbeiter %s %s hat sich eingeloggt",
                mitarbeiter.vorname, mitarbeiter.nachname);

        activityLogRepo. persist(log);
    }

    /**
     * Hilfsmethode:  Mitarbeiter laden und prüfen (NEU)
     */
    private MitarbeiterEntity getMitarbeiter(Long mitarbeiterId) {
        MitarbeiterEntity mitarbeiter = mitarbeiterRepo.findById(mitarbeiterId);
        if (mitarbeiter == null) {
            throw new NotFoundException("Mitarbeiter mit ID " + mitarbeiterId + " nicht gefunden");
        }
        return mitarbeiter;
    }

    /**
     * Gibt alle Logs zurück (sortiert nach Timestamp)
     */
    public List<ActivityLogEntity> getAllLogs() {
        return activityLogRepo.findAllSorted();
    }

    /**
     * Gibt Logs für ein spezifisches Feedback zurück
     */
    public List<ActivityLogEntity> getLogsByFeedback(Long feedbackId) {
        return activityLogRepo.findByFeedbackId(feedbackId);
    }

    /**
     * Gibt Logs für einen spezifischen Mitarbeiter zurück
     */
    public List<ActivityLogEntity> getLogsByMitarbeiter(Long mitarbeiterId) {
        return activityLogRepo.findByMitarbeiterId(mitarbeiterId);
    }

    /**
     * Gibt Logs für einen spezifischen Action Type zurück
     */
    public List<ActivityLogEntity> getLogsByActionType(String actionType) {
        return activityLogRepo.findByActionType(actionType);
    }

    /**
     * Gibt Logs in einem Zeitraum zurück
     */
    public List<ActivityLogEntity> getLogsByDateRange(Instant from, Instant to) {
        return activityLogRepo.findByDateRange(from, to);
    }

    /**
     * Komplexe Filterung
     */
    public List<ActivityLogEntity> getLogsByFilters(Long mitarbeiterId, Long feedbackId,
                                                    String actionType, Instant from, Instant to) {
        return activityLogRepo.findByFilters(mitarbeiterId, feedbackId, actionType, from, to);
    }

    /**
     * Action Type Konstanten
     */
    public static class ActionType {
        public static final String FEEDBACK_VIEWED = "FEEDBACK_VIEWED";
        public static final String FEEDBACK_STATUS_CHANGED = "FEEDBACK_STATUS_CHANGED";
        public static final String FEEDBACK_CREATED = "FEEDBACK_CREATED";
        public static final String NOTIFICATION_EMAIL_SENT = "NOTIFICATION_EMAIL_SENT";
        public static final String NOTIFICATION_SMS_SENT = "NOTIFICATION_SMS_SENT";
        public static final String EMPLOYEE_LOGIN = "EMPLOYEE_LOGIN";
    }
}