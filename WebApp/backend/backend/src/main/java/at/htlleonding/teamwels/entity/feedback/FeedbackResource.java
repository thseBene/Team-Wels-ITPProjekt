package at.htlleonding.teamwels.entity.feedback;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import java.net.URI;
import java.util.List;

@Path("/api/feedback")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class FeedbackResource {

    @Inject
    FeedbackRepository repo;

    @GET
    public List<FeedbackEntity> list() {
        // listAll() ist von PanacheRepository verfügbar
        return repo.listAll();
    }

    @GET
    @Path("{id}")
    public FeedbackEntity get(@PathParam("id") Long id) {
        FeedbackEntity f = repo.findById(id);
        if (f == null) {
            throw new NotFoundException("Feedback nicht gefunden");
        }
        return f;
    }

    @POST
    @Transactional
    public void create(FeedbackEntity feedback) {
        repo.persist(feedback); // nach persist enthält feedback.id den DB-Wert
    }

    @PUT
    @Path("{id}")
    @Transactional
    public FeedbackEntity update(@PathParam("id") Long id, FeedbackEntity payload) {
        FeedbackEntity existing = repo.findById(id);
        if (existing == null) {
            throw new NotFoundException("Feedback nicht gefunden");
        }
        // einfache Feldkopie (keine DTOs)
        existing.author = payload.author;
        existing.message = payload.message;
        // kein repo.persist nötig, da das Entity managed ist
        return existing;
    }

    @DELETE
    @Path("{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        boolean deleted = repo.deleteById(id);
        if (!deleted) {
            throw new NotFoundException("Feedback nicht gefunden");
        }
        return Response.noContent().build();
    }
}