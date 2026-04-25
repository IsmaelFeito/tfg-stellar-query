package es.tfg.ismaelfeito.backstellarquery.game.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;

@Entity
@Table(name = "misions")
public class Mision {

    @Id
    @Getter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // El front espera "titulo" pero la columna DB se llama "title"
    @Getter
    @Column(name = "title")
    @JsonProperty("titulo")
    private String titulo;

    @Getter
    @Column(name = "description_txt")
    @JsonProperty("descripcion")
    private String descripcion;

    @Getter
    @Column(name = "statement_txt")
    @JsonProperty("enunciado")
    private String enunciado;

    // La query correcta NUNCA se serializa al front (seguridad)
    @Getter
    @JsonIgnore
    @Column(name = "query_correct")
    private String queryCorrect;

    // El front espera "nivel" pero la columna DB se llama "level"
    @Getter
    @Column(name = "level")
    @JsonProperty("nivel")
    private String nivel;

    // El front espera "xpReward" pero la columna DB se llama "xp_reward"
    @Getter
    @Column(name = "xp_reward")
    @JsonProperty("xpReward")
    private Integer xpReward;

    // "order" es palabra reservada en SQL, se escapa con comillas en la columna
    @Getter
    @Column(name = "\"order\"")
    @JsonProperty("orden")
    private Integer orden;
}
