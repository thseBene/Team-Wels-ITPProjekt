package at.htlleonding.teamwels.entity.feedback.services;

import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import com.twilio. Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio. type.PhoneNumber;

import java.security.SecureRandom;

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
        if (accountSid != null && ! accountSid.isBlank() && authToken != null && !authToken.isBlank()) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void sendSms(String toNumber, String body) {
        if (accountSid == null || accountSid.isBlank() || authToken == null || authToken.isBlank()) {
            throw new IllegalStateException("Twilio ist nicht konfiguriert (twilio.account-sid / twilio.auth-token fehlen)");
        }
        if (fromNumber == null || fromNumber.isBlank()) {
            throw new IllegalStateException("Twilio From-Nummer ist nicht konfiguriert (twilio.from)");
        }
        try {
            Message.creator(
                    new PhoneNumber(toNumber),
                    new PhoneNumber(fromNumber),
                    body
            ).create();

        } catch (Exception e) {
            throw new RuntimeException("Fehler beim Twilio-SMS-Versand: " + e.getMessage(), e);
        }
    }

    // NEU: SMS-Verifizierungscode senden
    public void sendVerificationSms(String toNumber, String code) {
        String body = String.format(
                "Team Wels Verifizierung:\n\nIhr Code lautet: %s\n\nDieser Code ist 10 Minuten gültig.",
                code
        );
        sendSms(toNumber, body);
    }

    // NEU: 6-stelligen Verifizierungscode generieren
    public static String generateVerificationCode() {
        SecureRandom random = new SecureRandom();
        int code = 100000 + random.nextInt(900000); // 6-stellig
        return String.valueOf(code);
    }
}