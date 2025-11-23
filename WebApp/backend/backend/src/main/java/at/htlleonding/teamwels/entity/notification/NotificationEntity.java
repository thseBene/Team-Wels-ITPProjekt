package at.htlleonding.teamwels.entity.notification;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "notification")
public class NotificationEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "typ", nullable = false)
    public String typ; // "EMAIL" oder "SMS"

    @Column(name = "nachricht", columnDefinition = "text", nullable = false)
    public String nachricht;

    @Column(name = "betreff")  // ← HIER WAR DAS PROBLEM! Muss "betreff" sein, nicht "betreff_feedback"
    public String betreff; // nur für E-Mail relevant

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "benutzer_id")
    @JsonIgnoreProperties({"feedbacks"})
    public BenutzerEntity benutzer;

    @Column(name = "gelesen", nullable = false)
    public Boolean gelesen = false;

    @Column(name = "created_at", nullable = false)
    public Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (gelesen == null) {
            gelesen = false;
        }
    }

    // Hilfsmethoden für Abfragen
    public static NotificationEntity findByIdOrNull(Long id) {
        return findById(id);
    }
}