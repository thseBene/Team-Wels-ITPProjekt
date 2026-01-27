package at.htlleonding.teamwels.entity. benutzer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "benutzer")
public class BenutzerEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType. IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "mail", unique = true, nullable = true)
    public String mail;

    @Column(name = "tel", unique = true, nullable = true)
    public String tel;

    @Column(name = "rolle", nullable = false)
    public String rolle;

    // E-Mail-Verifizierung (mit Token/Link)
    @Column(name = "email_verified", nullable = false)
    public Boolean emailVerified = false;

    @Column(name = "email_verification_token")
    public String emailVerificationToken;

    @Column(name = "email_verification_token_created_at")
    public LocalDateTime emailVerificationTokenCreatedAt;

    // Telefon-Verifizierung (mit 6-stelligem Code)
    @Column(name = "tel_verified", nullable = false)
    public Boolean telVerified = false;

    @Column(name = "tel_verification_code")
    public String telVerificationCode;

    @Column(name = "tel_verification_code_created_at")
    public LocalDateTime telVerificationCodeCreatedAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType. ALL)
    @JsonIgnore
    public List<at.htlleonding.teamwels.entity.feedback.FeedbackEntity> feedbacks = new ArrayList<>();

    // E-Mail-Verifizierung
    public void generateEmailVerificationToken() {
        this.emailVerificationToken = UUID. randomUUID().toString();
        this.emailVerificationTokenCreatedAt = LocalDateTime.now();
    }

    public boolean isEmailVerificationTokenValid() {
        if (emailVerificationToken == null || emailVerificationTokenCreatedAt == null) {
            return false;
        }
        return emailVerificationTokenCreatedAt.plusHours(24).isAfter(LocalDateTime.now());
    }

    // Telefon-Verifizierung (10 Minuten gültig)
    public void generateTelVerificationCode(String code) {
        this.telVerificationCode = code;
        this.telVerificationCodeCreatedAt = LocalDateTime.now();
    }

    public boolean isTelVerificationCodeValid() {
        if (telVerificationCode == null || telVerificationCodeCreatedAt == null) {
            return false;
        }
        return telVerificationCodeCreatedAt.plusMinutes(10).isAfter(LocalDateTime.now());
    }

    // Prüfen ob User vollständig verifiziert ist
    public boolean isFullyVerified() {
        boolean emailOk = (mail == null || mail.isEmpty() || emailVerified);
        boolean telOk = (tel == null || tel.isEmpty() || telVerified);
        return emailOk && telOk;
    }

    // Bestehende Methoden
    public static BenutzerEntity findByMail(String mail) {
        if (mail == null) return null;
        String normalized = normalizeMail(mail);
        return find("lower(mail) = ?1", normalized).firstResult();
    }

    public static BenutzerEntity findByTel(String tel) {
        if (tel == null) return null;
        String normalized = normalizeTel(tel);
        return find("tel = ?1", normalized).firstResult();
    }

    public static String normalizeMail(String mail) {
        if (mail == null) return null;
        return mail.trim().toLowerCase();
    }

    public static String normalizeTel(String tel) {
        if (tel == null || tel.trim().isEmpty()) {
            return null;
        }

        String t = tel.trim();

        // 1. Alle Zeichen außer + und Ziffern entfernen
        t = t.replaceAll("[^+0-9]", "");

        // 2. Mehrfache + entfernen (nur am Anfang behalten)
        if (t.contains("+")) {
            t = "+" + t.replaceAll("\\+", "");
        }

        // 3. Führende 00 durch + ersetzen (z.B. 0043 → +43)
        if (t.startsWith("00")) {
            t = "+" + t.substring(2);
        }

        // 4. Österreichische Nummer ohne Ländercode: 0676... → +43676...
        if (t.startsWith("0") && !t.startsWith("00")) {
            t = "+43" + t.substring(1);  // Entferne führende 0
        }

        // 5. Falls keine Ländervorwahl: Standardmäßig +43 (Österreich)
        if (!t.startsWith("+")) {
            t = "+43" + t;
        }

        System.out.println("[normalizeTel] '" + tel + "' → '" + t + "'");

        return t;
    }
}