package es.tfg.ismaelfeito.backstellarquery.game.repository;

import es.tfg.ismaelfeito.backstellarquery.game.entity.Mision;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MisionRepository extends JpaRepository<Mision, Long> {

    // Devuelve las misiones ordenadas por su campo "orden" ascendente
    List<Mision> findAllByOrderByOrdenAsc();
}
