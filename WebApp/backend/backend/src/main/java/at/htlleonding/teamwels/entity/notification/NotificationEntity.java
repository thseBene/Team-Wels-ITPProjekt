package at.htlleonding.teamwels.entity.notification;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import at.htlleonding.teamwels.entity.feedback.FeedbackEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class NotificationEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @ManyToOne
    @JoinColumn(name = "benutzer_id")
    public BenutzerEntity benutzer;

    @Column(name = "typ", nullable = false)
    public String typ; // EMAIL oder SMS

    @OneToOne
    public FeedbackEntity feedback;

    @Column(name = "created_at", nullable = false)
    public LocalDateTime createdAt;

    // NEU: Status ob schon versendet
    @Column(name = "sent", nullable = false)
    public Boolean sent = false;

    @Column(name = "sent_at")
    public LocalDateTime sentAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}