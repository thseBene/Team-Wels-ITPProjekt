package at.htlleonding.teamwels.entity.feedback;

import at.htlleonding.teamwels.entity.feedback.services.FeedbackService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

/**
 * REST-Resource für Feedback-Endpunkte.
 * Gibt FeedbackDTO zurück, um Lazy-Loading-Probleme zu vermeiden.
 */
@Path("/api/feedback")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FeedbackResource {

    @Inject
    FeedbackService service;

    @GET
    @Transactional
    public List<FeedbackDTO> list() {
        return service.getAllFeedbacks().stream()
                .map(FeedbackMapper::toDto)
                .collect(Collectors.toList());
    }

    @GET
    @Path("{id}")
    @Transactional
    public FeedbackDTO get(@PathParam("id") Long id) {
        return FeedbackMapper.toDto(service.getFeedback(id));
    }

    @POST
    @Transactional
    public Response create(FeedbackService.FeedbackPayload payload) {
        FeedbackEntity created = service.createFeedback(payload);
        FeedbackDTO resp = FeedbackMapper.toDto(created);
        return Response.created(URI.create("/api/feedback/" + created.id))
                .entity(resp)
                .build();
    }

    @PUT
    @Path("{id}")
    @Transactional
    public FeedbackDTO update(@PathParam("id") Long id, FeedbackService.FeedbackPayload payload) {
        FeedbackEntity updated = service.updateFeedback(id, payload);
        return FeedbackMapper.toDto(updated);
    }

    @PATCH
    @Path("{id}/status")
    @Transactional
    public FeedbackDTO updateStatus(@PathParam("id") Long id, StatusUpdatePayload payload) {
        FeedbackEntity updated = service.updateStatus(id, payload.status);
        return FeedbackMapper.toDto(updated);
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        service.deleteFeedback(id);
        return Response.noContent().build();
    }

    // Minimales DTO für Status-Update
    public static class StatusUpdatePayload {
        public String status;
    }
}