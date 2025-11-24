package at.htlleonding.teamwels.entity.feedback;

import java.time.Instant;

/**
 * DTO für Feedback-Antworten (keine verknüpften Collections).
 */
public class FeedbackDTO {
    public Long id;
    public String subject;
    public String description;
    public String type;
    public String status;
    public Long userId;
    public String userMail;
    public String userTel;
    public Instant createdAt;
    public Instant updatedAt;

    public FeedbackDTO() {}

    public FeedbackDTO(Long id, String subject, String description, String type, String status,
                       Long userId, String userMail, String userTel,
                       Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.subject = subject;
        this.description = description;
        this.type = type;
        this.status = status;
        this.userId = userId;
        this.userMail = userMail;
        this.userTel = userTel;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}