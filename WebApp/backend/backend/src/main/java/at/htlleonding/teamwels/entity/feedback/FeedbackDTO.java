package at.htlleonding.teamwels.entity.feedback;

import java.time.Instant;

/**
 * DTO für Feedback-Antworten (keine verknüpften Collections).
 */
public record FeedbackDTO(Long id, String subject, String description, String type, String status,
                       Long userId, String userMail, String userTel,
                       Instant createdAt, Instant updatedAt) {

}