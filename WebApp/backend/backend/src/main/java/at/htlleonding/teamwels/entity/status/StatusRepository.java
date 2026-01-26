package at.htlleonding.teamwels.entity.status;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class StatusRepository implements PanacheRepository<StatusEntity> {
}