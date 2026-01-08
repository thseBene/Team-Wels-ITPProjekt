package at.htlleonding.teamwels.entity.mitarbeiter;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class MitarbeiterRepository implements PanacheRepository<MitarbeiterEntity> {
}
