package at.htlleonding.teamwels.entity. activitylog;

import at.htlleonding.teamwels.entity.mitarbeiter.MitarbeiterEntity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import org.hibernate.annotations.Fetch;

import java.time. Instant;

@Entity
@Table(name = "activity_log")
public class ActivityLogEntity extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    public Long id;

    @Column(name = "timestamp", nullable = false)
    public Instant timestamp;

    @Column(name = "action_type", nullable = false)
    public String actionType;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mitarbeiter_id")
    @JsonIgnoreProperties({"benutzer", "passwort", "letzterLogin"})
    public MitarbeiterEntity mitarbeiter;

    @Column(name = "feedback_id")
    public Long feedbackId;

    @Column(name = "feedback_subject")
    public String feedbackSubject;

    @Column(name = "details", columnDefinition = "text")
    public String details;

    @Column(name = "old_value")
    public String oldValue;

    @Column(name = "new_value")
    public String newValue;

    public ActivityLogEntity() {
        this.timestamp = Instant.now();
    }
}