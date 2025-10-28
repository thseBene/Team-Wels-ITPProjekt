package at.htlleonding.teamwels.entity.feedback;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.time.Instant;

@Entity
@Table(name="feedback")
public class FeedbackEntity extends PanacheEntity {

    @Column(nullable = false)
    public String author;

    @Column(nullable = false)
    public String message;

    @Column(name = "created_at",nullable = false)
    public Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }


}
