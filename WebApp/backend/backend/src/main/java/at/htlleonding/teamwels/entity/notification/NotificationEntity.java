package at.htlleonding.teamwels.entity.notification;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "notification")
public class NotificationEntity extends PanacheEntity {

    @Column(name = "typ", nullable = false)
    public String typ;

    @Column(name = "nachricht", columnDefinition = "text", nullable = false)
    public String nachricht;

    @Column(name = "betreff")
    public String betreff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "benutzer_id", nullable = false)
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
}
