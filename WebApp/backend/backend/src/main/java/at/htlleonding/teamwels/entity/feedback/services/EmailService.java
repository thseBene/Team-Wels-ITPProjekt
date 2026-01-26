package at.htlleonding.teamwels.entity.feedback.services;

import at.htlleonding.teamwels.entity.feedback.FeedbackEntity;
import at.htlleonding.teamwels.entity.feedback.Status;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * E-Mail-Service für Quarkus Mailer
 * Konfiguration über application.properties
 */
@ApplicationScoped
public class EmailService {

    @Inject
    Mailer mailer;

    @ConfigProperty(name = "app.base-url", defaultValue = "http://localhost:4200")
    String baseUrl;

    /**
     * Sendet eine Bestätigungs-E-Mail mit Verifizierungs-Link
     */
    public void sendVerificationEmail(String email, String verificationToken) {
        String verificationLink = baseUrl + "/verify-email.html?token=" + verificationToken;

        String subject = "E-Mail-Adresse bestätigen - Team Wels";
        String body = String.format(
                "<html>" +
                        "<body>" +
                        "<h2>Willkommen bei Team Wels! </h2>" +
                        "<p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf den folgenden Link klicken:</p>" +
                        "<p><a href=\"%s\">E-Mail-Adresse bestätigen</a></p>" +
                        "<p>Dieser Link ist 24 Stunden gültig.</p>" +
                        "<p>Falls Sie diese E-Mail nicht angefordert haben, ignorieren Sie diese bitte.</p>" +
                        "<br>" +
                        "<p>Mit freundlichen Grüßen<br>Ihr Team Wels</p>" +
                        "</body>" +
                        "</html>",
                verificationLink
        );

        try {
            mailer. send(Mail.withHtml(email, subject, body));
        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Versenden der Verifizierungs-E-Mail:  " + e.getMessage(), e);
        }
    }

    /**
     * Sendet eine Willkommens-E-Mail nach erfolgreicher Verifizierung
     */
    public void sendWelcomeEmail(String email) {
        String subject = "Willkommen bei Team Wels!";
        String body =
                "<html>" +
                        "<body>" +
                        "<h2>Ihre E-Mail-Adresse wurde erfolgreich bestätigt!</h2>" +
                        "<p>Sie können jetzt alle Funktionen von Team Wels nutzen. </p>" +
                        "<p>Mit freundlichen Grüßen<br>Ihr Team Wels</p>" +
                        "</body>" +
                        "</html>";

        try {
            mailer.send(Mail.withHtml(email, subject, body));
        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Versenden der Willkommens-E-Mail: " + e. getMessage(), e);
        }
    }
    public void sendEmail(FeedbackEntity feedback) {
        String subject = "Anliegen: " + feedback.subject;
        String body = String.format(
                "Sehr geehrte/r Benutzer,\n\n" +
                        "Ihr Feedback '%s' ist bei uns angekommen:\n" +
                        "Mit freundlichen Grüßen\n" +
                        "Ihr Team Wels",
                feedback.subject);
        Mail mail = Mail.withText(feedback.user.mail, subject,body);
        try {
            mailer.send(mail);
        }
        catch (Exception e) {
            throw new RuntimeException("Fehler beim Versenden der E-Mail",e);
        }
    }
    public void sendEmailUpdatedStatus(FeedbackEntity feedback, Status altStatus) {
        String subject = "Anliegen: " + feedback.subject;
        String body = String.format("Sehr geehrte/r Benutzer,\n\n" +
                        "Ihr Feedback '%s' hat eine Statusänderung erhalten:\n" +
                        "Alter Status: %s → Neuer Status: %s\n\n" +
                        "Mit freundlichen Grüßen\n" +
                        "Ihr Team Wels",
                feedback.subject, altStatus, feedback.status);
        Mail mail = Mail.withText(feedback.user.mail, subject, body);
        try {
            mailer.send(mail);
        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Versenden der E-Mail", e);
        }
    }
}