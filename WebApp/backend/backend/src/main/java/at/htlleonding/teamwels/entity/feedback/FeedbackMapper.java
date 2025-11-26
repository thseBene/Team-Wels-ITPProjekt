package at.htlleonding.teamwels.entity.feedback;

/**
 * Einfacher Mapper: FeedbackEntity -> FeedbackDTO
 */
public class FeedbackMapper {

    public static FeedbackDTO toDto(FeedbackEntity e) {
        if (e == null) return null;
        Long userId = null;
        String mail = null;
        String tel = null;
        if (e.user != null) {
            // primitive Eigenschaften des Benutzers lesen (Session muss offen sein!)
            userId = e.user.id;
            mail = e.user.mail;
            tel = e.user.tel;
        }
        String statusLabel = (e.status != null) ? e.status.getLabel() : null;

        return new FeedbackDTO(
                e.id,
                e.subject,
                e.description,
                e.type,
                statusLabel,
                userId,
                mail,
                tel,
                e.createdAt,
                e.updatedAt
        );
    }
}