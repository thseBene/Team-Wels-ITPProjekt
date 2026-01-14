package at.htlleonding.teamwels.entity.kategorie;

import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class KategorieRepository implements PanacheRepository<KategorieEntity> {
}