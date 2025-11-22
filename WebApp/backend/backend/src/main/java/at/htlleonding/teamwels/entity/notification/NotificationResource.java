package at.htlleonding.teamwels.entity.notification;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;

/**
 * REST-Resource für Notification-Endpunkte
 */
@Path("/api/notifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NotificationResource {

    @GET
    public List<NotificationEntity> listAll() {
        return NotificationEntity.listAll();
    }

    @GET
    @Path("benutzer/{benutzerId}")
    public List<NotificationEntity> listByBenutzer(@PathParam("benutzerId") Long benutzerId) {
        return NotificationEntity.list("benutzer.id", benutzerId);
    }

    @GET
    @Path("ungelesen/{benutzerId}")
    public List<NotificationEntity> listUnreadByBenutzer(@PathParam("benutzerId") Long benutzerId) {
        return NotificationEntity.list("benutzer.id = ?1 and gelesen = false", benutzerId);
    }

    @PATCH
    @Path("{id}/gelesen")
    @Transactional
    public Response markAsRead(@PathParam("id") Long id) {
        NotificationEntity notification = NotificationEntity.findById(id);
        if (notification == null) {
            throw new NotFoundException("Notification mit ID " + id + " nicht gefunden");
        }
        notification.gelesen = true;
        return Response.ok(notification).build();
    }
}
