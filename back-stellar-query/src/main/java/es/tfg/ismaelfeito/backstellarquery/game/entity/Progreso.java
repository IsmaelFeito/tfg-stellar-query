package es.tfg.ismaelfeito.backstellarquery.game.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(
        name = "progreso",
        uniqueConstraints = @UniqueConstraint(columnNames = {"username", "mision_id"})
)
public class Progreso {

    @Id
    @Getter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Referencia al usuario por username (string) porque la tabla users está
    // en otra base de datos y no podemos usar FK cross-DB
    @Getter @Setter
    private String username;

    @Getter @Setter
    @Column(name = "mision_id")
    @JsonProperty("misionId")
    private Long misionId;

    @Getter @Setter
    private Boolean completada = false;

    @Getter @Setter
    private Integer intentos = 0;

    @Getter @Setter
    @Column(name = "xp_ganado")
    @JsonProperty("xpGanado")
    private Integer xpGanado = 0;
}
