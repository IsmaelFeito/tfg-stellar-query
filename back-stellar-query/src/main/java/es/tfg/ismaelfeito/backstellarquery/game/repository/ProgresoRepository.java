package es.tfg.ismaelfeito.backstellarquery.game.repository;

import es.tfg.ismaelfeito.backstellarquery.game.entity.Progreso;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProgresoRepository extends JpaRepository<Progreso, Long> {

    // Todo el progreso de un usuario
    List<Progreso> findByUsername(String username);

    // Progreso de un usuario en una misión concreta
    Optional<Progreso> findByUsernameAndMisionId(String username, Long misionId);
}
