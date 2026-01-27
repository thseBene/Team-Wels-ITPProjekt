package at.htlleonding.teamwels.security;

import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerResponseContext;
import jakarta.ws.rs.container.ContainerResponseFilter;
import jakarta.ws.rs.ext.Provider;
import java.io.IOException;

@Provider
public class NoCacheFilter implements ContainerResponseFilter {

    @Override
    public void filter(ContainerRequestContext requestContext,
                       ContainerResponseContext responseContext) throws IOException {

        String method = requestContext.getMethod();
        String path = requestContext.getUriInfo().getPath();

        // Für alle POST-Requests: Kein Caching
        if ("POST".equals(method)) {
            responseContext.getHeaders().add("Cache-Control", "no-cache, no-store, must-revalidate");
            responseContext.getHeaders().add("Pragma", "no-cache");
            responseContext.getHeaders().add("Expires", "0");
        }

        // Speziell für Verifizierungs-Endpoints
        if (path.contains("verify-email") || path.contains("verify-tel")) {
            responseContext.getHeaders().add("Cache-Control", "no-cache, no-store, must-revalidate");
            responseContext.getHeaders().add("Pragma", "no-cache");
            responseContext.getHeaders().add("Expires", "0");
        }
    }
}