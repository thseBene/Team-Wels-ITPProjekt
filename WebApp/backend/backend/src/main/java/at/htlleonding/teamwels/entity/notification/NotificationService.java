package at.htlleonding.teamwels.entity.notification;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import at.htlleonding.teamwels.entity.feedback.FeedbackEntity;
import at.htlleonding.teamwels.entity.feedback.services.EmailService;
import at.htlleonding.teamwels.entity.feedback.services.SmsService;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@ApplicationScoped
public class NotificationService {

    @Inject
    SmsService smsService;

    @Inject
    EmailService emailService;

    /**
     * Erstellt Notification für Feedback-Erstellung
     */
    @Transactional
    public void createFeedbackNotification(FeedbackEntity feedback) {
        BenutzerEntity user = feedback.user;

        // E-Mail Notification
        if (user.mail != null && !user.mail.isEmpty()) {
            NotificationEntity notification = new NotificationEntity();
            notification.benutzer = user;
            notification.feedback = feedback;
            notification.typ = "EMAIL";
            notification.sent = false;
            notification.persist();

            // Sofort senden wenn verifiziert
            if (user.emailVerified) {
                sendNotification(notification);
            }
        }

        // SMS Notification
        if (user.tel != null && !user.tel.isEmpty()) {
            NotificationEntity notification = new NotificationEntity();
            notification.benutzer = user;
            notification.feedback = feedback;
            notification.typ = "SMS";
            notification.sent = false;
            notification.persist();

            // Sofort senden wenn verifiziert
            if (user.telVerified) {
                sendNotification(notification);
            }
        }
    }
    @Transactional
    public void sendNotification(NotificationEntity notification) {
        if (notification.sent) {
            return; // Bereits gesendet
        }

        try {
            if ("EMAIL".equals(notification.typ)) {
                emailService.sendEmail(notification.feedback);
            } else if ("SMS".equals(notification.typ)) {
                smsService.sendCreatedSms(notification.benutzer.tel, notification.feedback);
            }

            // Als gesendet markieren
            notification.sent = true;
            notification.sentAt = LocalDateTime.now();

            System.out.println("Notification gesendet: " + " -> " + notification.typ);

        } catch (Exception e) {
            System.err.println("Fehler beim Versenden: " + e.getMessage());
        }
    }
    @Transactional
    public int sendPendingEmailNotifications(BenutzerEntity user) {
        List<NotificationEntity> pending = NotificationEntity.list(
                "benutzer.id = ?1 AND typ = 'EMAIL' AND sent = false",
                user.id
        );

        System.out.println("Sende " + pending.size() + " ausstehende E-Mail-Notifications...");

        for (NotificationEntity notification : pending) {
            sendNotification(notification);
        }

        return pending.size();
    }

    /**
     * Sendet alle ausstehenden SMS-Notifications für einen User
     */
    @Transactional
    public int sendPendingSmsNotifications(BenutzerEntity user) {
        List<NotificationEntity> pending = NotificationEntity.list(
                "benutzer.id = ?1 AND typ = 'SMS' AND sent = false",
                user.id
        );

        System.out.println("Sende " + pending.size() + " ausstehende SMS-Notifications...");

        for (NotificationEntity notification : pending) {
            sendNotification(notification);
        }

        return pending.size();
    }
}