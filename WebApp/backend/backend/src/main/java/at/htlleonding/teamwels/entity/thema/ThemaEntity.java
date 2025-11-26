package at.htlleonding.teamwels.entity.thema;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "thema")
public class ThemaEntity extends PanacheEntity {

    @Column(name = "bezeichnung", nullable = false)
    public String bezeichnung;


}