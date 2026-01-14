<<<<<<< Updated upstream
package at.htlleonding.teamwels.entity.benutzer;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "benutzer")
public class BenutzerEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "mail", unique = true, nullable = true)
    public String mail;

    @Column(name = "tel", unique = true, nullable = true)
    public String tel;

    @Column(name = "rolle", nullable = false)
    public String rolle;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    public List<at.htlleonding.teamwels.entity.feedback.FeedbackEntity> feedbacks = new ArrayList<>();

    // Hilfsmethode für Abfragen (normalisiert/vergleich in lower-case für Mail)
    public static BenutzerEntity findByMail(String mail) {
        if (mail == null) return null;
        String normalized = normalizeMail(mail);
        // query lower(mail) = ?1
        return find("lower(mail) = ?1", normalized).firstResult();
    }

    // Hilfsmethode für Telefonnummern (normalisiert auf + und Ziffern)
    public static BenutzerEntity findByTel(String tel) {
        if (tel == null) return null;
        String normalized = normalizeTel(tel);
        return find("tel = ?1", normalized).firstResult();
    }

    // Normalisierung: trim + toLowerCase (for mail)
    public static String normalizeMail(String mail) {
        if (mail == null) return null;
        return mail.trim().toLowerCase();
    }

    // Normalisierung der Telefonnummer: behalte führendes + (falls vorhanden) und Ziffern
    public static String normalizeTel(String tel) {
        if (tel == null) return null;
        String t = tel.trim();
        // Falls führendes + vorhanden, behalten, sonst nur Ziffern
        boolean startsWithPlus = t.startsWith("+");
        // Entferne alle Zeichen außer + und Ziffern, dann falls + nicht an Anfang sondern irgendwo, entfernen
        t = t.replaceAll("[^+0-9]", "");
        if (startsWithPlus) {
            // sicherstellen, dass + nur vorne steht
            if (!t.startsWith("+")) {
                t = "+" + t.replaceAll("\\+", "");
            }
        } else {
            // entferne alle '+' falls vorhanden
            t = t.replaceAll("\\+", "");
        }
        return t;
    }
=======
package at.htlleonding.teamwels.entity.benutzer;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "benutzer")
public class BenutzerEntity extends PanacheEntity {

    @Column(name = "vorname", nullable = false)
    public String vorname;

    @Column(name = "nachname", nullable = false)
    public String nachname;

    @Column(name = "rolle", nullable = false)
    public String rolle;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore
    public List<at.htlleonding.teamwels.entity.feedback.FeedbackEntity> feedbacks = new ArrayList<>();
>>>>>>> Stashed changes
}