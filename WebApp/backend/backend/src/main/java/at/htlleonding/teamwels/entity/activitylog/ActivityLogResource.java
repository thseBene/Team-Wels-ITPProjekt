package at. htlleonding.teamwels.entity.activitylog;

import jakarta.inject.Inject;
import jakarta. ws.rs.*;
import jakarta.ws.rs. core.MediaType;
import jakarta.ws. rs.core.Response;

import java.time.Instant;
import java.util.List;

@Path("/api/activitylog")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType. APPLICATION_JSON)
public class ActivityLogResource {

    @Inject
    ActivityLogService activityLogService;

    /**
     * GET /api/activitylog - Alle Logs abrufen (mit optionalen Filtern)
     */
    @GET
    public Response getAllLogs(
            @QueryParam("mitarbeiterId") Long mitarbeiterId,
            @QueryParam("feedbackId") Long feedbackId,
            @QueryParam("actionType") String actionType,
            @QueryParam("from") String from,
            @QueryParam("to") String to
    ) {
        try {
            Instant fromInstant = from != null ? Instant.parse(from) : null;
            Instant toInstant = to != null ? Instant.parse(to) : null;

            List<ActivityLogEntity> logs;

            // Wenn keine Filter gesetzt sind, alle zurückgeben
            if (mitarbeiterId == null && feedbackId == null && actionType == null
                    && fromInstant == null && toInstant == null) {
                logs = activityLogService.getAllLogs();
            } else {
                // Mit Filtern
                logs = activityLogService. getLogsByFilters(
                        mitarbeiterId, feedbackId, actionType, fromInstant, toInstant
                );
            }

            return Response.ok(logs).build();
        } catch (Exception e) {
            return Response.status(Response.Status. BAD_REQUEST)
                    . entity("Fehler beim Abrufen der Logs: " + e. getMessage())
                    .build();
        }
    }
    @GET
    @Path("{id}")
    public Response getLogsById(@PathParam("id") Long id){
        ActivityLogEntity log = activityLogService.getLogById(id);
        return Response.ok(log).build();
    }

    @GET
    @Path("/all")
    public Response getAll(){
        return Response.ok(activityLogService.getAllLogs()).build();
    }

    /**
     * GET /api/activitylog/feedback/{feedbackId} - Logs für ein spezifisches Feedback
     */
    @GET
    @Path("/feedback/{feedbackId}")
    public Response getLogsByFeedback(@PathParam("feedbackId") Long feedbackId) {
        List<ActivityLogEntity> logs = activityLogService.getLogsByFeedback(feedbackId);
        return Response.ok(logs).build();
    }

    /**
     * GET /api/activitylog/mitarbeiter/{mitarbeiterId} - Logs für einen Mitarbeiter
     */
    @GET
    @Path("/mitarbeiter/{mitarbeiterId}")
    public Response getLogsByMitarbeiter(@PathParam("mitarbeiterId") Long mitarbeiterId) {
        List<ActivityLogEntity> logs = activityLogService.getLogsByMitarbeiter(mitarbeiterId);
        return Response.ok(logs).build();
    }

    /**
     * GET /api/activitylog/types/{actionType} - Logs nach Typ filtern
     */
    @GET
    @Path("/types/{actionType}")
    public Response getLogsByActionType(@PathParam("actionType") String actionType) {
        List<ActivityLogEntity> logs = activityLogService.getLogsByActionType(actionType);
        return Response.ok(logs).build();
    }

    /**
     * GET /api/activitylog/types - Liste aller verfügbaren Action Types
     */
    @GET
    @Path("/types")
    public Response getActionTypes() {
        String[] types = {
                ActivityLogService.ActionType.FEEDBACK_VIEWED,
                ActivityLogService.ActionType.FEEDBACK_STATUS_CHANGED,
                ActivityLogService.ActionType.FEEDBACK_CREATED,
                ActivityLogService.ActionType.NOTIFICATION_EMAIL_SENT,
                ActivityLogService.ActionType.NOTIFICATION_SMS_SENT,
                ActivityLogService. ActionType.EMPLOYEE_LOGIN
        };
        return Response.ok(types).build();
    }
}