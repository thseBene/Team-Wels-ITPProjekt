package at.htlleonding.teamwels.entity.feedback;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "feedback")
public class FeedbackEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "betreff", nullable = false)
    public String subject;

    @Column(name = "beschreibung", columnDefinition = "text", nullable = false)
    public String description;

    @Column(name = "typ", nullable = false)
    public String type;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    public Status status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"feedbacks"})
    public BenutzerEntity user;

    // Hinweis: Thema- und Kategorien-Beziehungen wurden entfernt, damit keine Lazy-Loading-Probleme auftreten.
    // Wenn du später wieder Verknüpfungen brauchst, können wir diese wieder hinzufügen und mit DTOs/Fetch-Strategie absichern.

    @Column(name = "created_at", nullable = false)
    public Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    public Instant updatedAt;

    @PrePersist
    void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) {
            createdAt = now;
        }
        if (updatedAt == null) {
            updatedAt = now;
        }
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }
}