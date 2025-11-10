package at.htlleonding.teamwels.entity.feedback;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import at.htlleonding.teamwels.entity.thema.ThemaEntity;
import at.htlleonding.teamwels.entity.status.StatusEntity;
import at.htlleonding.teamwels.entity.kategorie.KategorieEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "status_id")
    @JsonIgnoreProperties({"feedbacks"})
    public StatusEntity status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"feedbacks"})
    public BenutzerEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thema_id")
    @JsonIgnoreProperties({"feedbacks"})
    public ThemaEntity thema;

    @ManyToMany
    @JoinTable(
            name = "feedback_kategorie",
            joinColumns = @JoinColumn(name = "feedback_id"),
            inverseJoinColumns = @JoinColumn(name = "kategorie_id")
    )
    public List<KategorieEntity> kategorien = new ArrayList<>();


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