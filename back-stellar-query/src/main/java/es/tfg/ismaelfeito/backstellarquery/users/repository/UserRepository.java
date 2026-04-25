package es.tfg.ismaelfeito.backstellarquery.users.repository;

import es.tfg.ismaelfeito.backstellarquery.users.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

// FIX 1: el segundo genérico debe ser Long (tipo del @Id en User), no String
// FIX 2: findByEmail debe devolver Optional<User>, no Optional<String>
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
}
