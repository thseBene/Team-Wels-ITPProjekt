package at.htlleonding.teamwels.entity.mitarbeiter;

import at.htlleonding.teamwels.entity.activitylog.ActivityLogService;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Instant;


@Path("/api/auth")
@Produces(MediaType. APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    @Inject
    ActivityLogService activityLogService;

    @POST
    @Path("/login")
    @Transactional
    public Response login(LoginPayload payload) {

        // 1. Finde Mitarbeiter
        MitarbeiterEntity mitarbeiter = MitarbeiterEntity
                .findByBenutzername(payload.benutzername);

        if (mitarbeiter == null) {
            return Response.status(Response.Status. UNAUTHORIZED)
                    .entity("Ungültige Anmeldedaten")
                    .build();
        }

        // 2. Prüfe Passwort
        if (!payload.passwort.equals(mitarbeiter.passwort)) {
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity("Ungültige Anmeldedaten")
                    .build();
        }

        // 3. Update Login-Zeit
        mitarbeiter.letzterLogin = Instant.now();

        activityLogService.logEmployeeLogin(mitarbeiter.id);

        // 4.  Erstelle Session/Token (später mit JWT)
        return Response.ok(new LoginResponse(
                mitarbeiter.id,
                mitarbeiter.vorname,
                mitarbeiter.nachname,
                mitarbeiter.benutzer.mail  // ← Zugriff auf benutzer-Daten!
        )).build();
    }

    public static class LoginPayload {
        public String benutzername;
        public String passwort;
    }

    public static class LoginResponse {
        public Long id;
        public String vorname;
        public String nachname;
        public String mail;

        public LoginResponse(Long id, String vorname, String nachname, String mail) {
            this.id = id;
            this.vorname = vorname;
            this. nachname = nachname;
            this.mail = mail;
        }
    }
}