package at.htlleonding.teamwels.entity.notification;

import at.htlleonding.teamwels.entity.benutzer.BenutzerEntity;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/api/notifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NotificationResource {

    @GET
    public List<NotificationEntity> getAllNotifications() {
        return NotificationEntity.listAll();
    }

    @GET
    @Path("/benutzer/{benutzerId}")
    public List<NotificationEntity> getNotificationsByBenutzer(@PathParam("benutzerId") Long benutzerId) {
        return NotificationEntity.list("benutzer.id", benutzerId);
    }

    // NEU: Benachrichtigungen direkt per E-Mail abfragen
    @GET
    @Path("/mail/{mail}")
    public Response getNotificationsByMail(@PathParam("mail") String mail) {
        BenutzerEntity benutzer = BenutzerEntity.findByMail(mail);
        if (benutzer == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Kein Benutzer mit E-Mail " + mail + " gefunden")
                    .build();
        }
        List<NotificationEntity> notifications = NotificationEntity.list(
                "benutzer.id = ?1 and typ = 'EMAIL'", benutzer.id
        );
        return Response.ok(notifications).build();
    }

    // NEU: Benachrichtigungen direkt per Telefonnummer abfragen
    @GET
    @Path("/tel/{tel}")
    public Response getNotificationsByTel(@PathParam("tel") String tel) {
        BenutzerEntity benutzer = BenutzerEntity.findByTel(tel);
        if (benutzer == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("Kein Benutzer mit Telefonnummer " + tel + " gefunden")
                    .build();
        }
        List<NotificationEntity> notifications = NotificationEntity.list(
                "benutzer.id = ?1 and typ = 'SMS'", benutzer.id
        );
        return Response.ok(notifications).build();
    }

    @GET
    @Path("/ungelesen")
    public List<NotificationEntity> getUnreadNotifications() {
        return NotificationEntity.list("gelesen", false);
    }

    @GET
    @Path("/benutzer/{benutzerId}/ungelesen")
    public List<NotificationEntity> getUnreadNotificationsByBenutzer(@PathParam("benutzerId") Long benutzerId) {
        return NotificationEntity.list("benutzer.id = ?1 and gelesen = false", benutzerId);
    }

    @PATCH
    @Path("{id}/gelesen")
    @Transactional
    public Response markAsRead(@PathParam("id") Long id) {
        NotificationEntity notification = NotificationEntity.findById(id);
        if (notification == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(notification).build();
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = NotificationEntity.deleteById(id);
        if (!deleted) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.noContent().build();
    }
}