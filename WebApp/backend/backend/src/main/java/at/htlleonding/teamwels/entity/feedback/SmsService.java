package at.htlleonding.teamwels.entity.feedback;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

/**
 * Einfacher Twilio-basierter SMS-Service für Quarkus.
 * Konfiguration über application.properties / Umgebungsvariablen:
 *  - twilio.account-sid
 *  - twilio.auth-token
 *  - twilio.from
 */
@ApplicationScoped
public class SmsService {

    @ConfigProperty(name = "twilio.account-sid", defaultValue = "")
    String accountSid;

    @ConfigProperty(name = "twilio.auth-token", defaultValue = "")
    String authToken;

    @ConfigProperty(name = "twilio.from", defaultValue = "")
    String fromNumber;

    @PostConstruct
    void init() {
        if (accountSid != null && !accountSid.isBlank() && authToken != null && !authToken.isBlank()) {
            Twilio.init(accountSid, authToken);
        }
    }


    public String sendSms(String toNumber, String body) {
        if (accountSid == null || accountSid.isBlank() || authToken == null || authToken.isBlank()) {
            throw new IllegalStateException("Twilio ist nicht konfiguriert (twilio.account-sid / twilio.auth-token fehlen)");
        }
        if (fromNumber == null || fromNumber.isBlank()) {
            throw new IllegalStateException("Twilio From-Nummer ist nicht konfiguriert (twilio.from)");
        }
        try {
            Message message = Message.creator(
                    new PhoneNumber(toNumber),
                    new PhoneNumber(fromNumber),
                    body
            ).create();
            return message.getSid();
        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Twilio-SMS-Versand: " + e.getMessage(), e);
        }
    }
}