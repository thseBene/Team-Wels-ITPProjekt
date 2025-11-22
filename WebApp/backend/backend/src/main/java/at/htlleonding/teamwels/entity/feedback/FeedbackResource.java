package at.htlleonding.teamwels.entity.feedback;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.util.List;

/**
 * REST-Resource für Feedback-Endpunkte
 * Delegiert alle Business-Logik an den FeedbackService
 */
@Path("/api/feedback")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FeedbackResource {

    @Inject
    FeedbackService service;

    @GET
    public List<FeedbackEntity> list() {
        return service.getAllFeedbacks();
    }

    @GET
    @Path("{id}")
    public FeedbackEntity get(@PathParam("id") Long id) {
        return service.getFeedback(id);
    }

    @POST
    public Response create(FeedbackService.FeedbackPayload payload) {
        FeedbackEntity created = service.createFeedback(payload);
        return Response.created(URI.create("/api/feedback/" + created.id))
                .entity(created)
                .build();
    }

    @PUT
    @Path("{id}")
    public FeedbackEntity update(@PathParam("id") Long id, FeedbackService.FeedbackPayload payload) {
        return service.updateFeedback(id, payload);
    }

    @PATCH
    @Path("{id}/status")
    public FeedbackEntity updateStatus(@PathParam("id") Long id, StatusUpdatePayload payload) {
        return service.updateStatus(id, payload.status);
    }

    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") Long id) {
        service.deleteFeedback(id);
        return Response.noContent().build();
    }

    // Minimales DTO für Status-Update
    public static class StatusUpdatePayload {
        // jetzt String (z. B. "Neu" oder "IN_BEARBEITUNG")
        public String status;
    }
}