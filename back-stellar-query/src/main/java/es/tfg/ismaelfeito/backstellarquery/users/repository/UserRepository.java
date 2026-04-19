package es.tfg.ismaelfeito.backstellarquery.users.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import es.tfg.ismaelfeito.backstellarquery.users.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}