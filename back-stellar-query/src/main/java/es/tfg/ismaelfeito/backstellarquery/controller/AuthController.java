package es.tfg.ismaelfeito.backstellarquery.controller;

import es.tfg.ismaelfeito.backstellarquery.service.JWTService;
import es.tfg.ismaelfeito.backstellarquery.users.entity.User;
import es.tfg.ismaelfeito.backstellarquery.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JWTService jwtService;

    // BCrypt para hashear contraseñas — NUNCA guardes contraseñas en texto plano
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // ─── REGISTER ─────────────────────────────────────────────────────────────
    // POST /api/auth/register
    // Body: { "username": "...", "email": "...", "password": "..." }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String email    = body.get("email");
        String password = body.get("password");

        // Validación básica
        if (username == null || email == null || password == null ||
                username.isBlank() || email.isBlank() || password.isBlank()) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Todos los campos son obligatorios."));
        }

        if (password.length() < 6) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "La contraseña debe tener al menos 6 caracteres."));
        }

        // Comprobar si el usuario o email ya existen
        if (userRepository.findByUsername(username).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "El nombre de usuario ya está en uso."));
        }

        if (userRepository.findByEmail(email).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "El email ya está registrado."));
        }

        // Crear y guardar el usuario
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(encoder.encode(password));  // hashear antes de guardar
        user.setCreated_at(new Date());
        userRepository.save(user);

        // Generar token y devolver respuesta
        String token = jwtService.generateToken(username);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of(
                        "token", token,
                        "user", Map.of(
                                "id",       user.getId(),
                                "username", user.getUsername(),
                                "email",    user.getEmail()
                        )
                ));
    }

    // ─── LOGIN ────────────────────────────────────────────────────────────────
    // POST /api/auth/login
    // Body: { "username": "...", "password": "..." }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || password == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Usuario y contraseña son obligatorios."));
        }

        // Buscar usuario en la BD
        Optional<User> optUser = userRepository.findByUsername(username);

        if (optUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales incorrectas. Acceso denegado."));
        }

        User user = optUser.get();

        // Verificar contraseña con BCrypt
        if (!encoder.matches(password, user.getPassword())) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales incorrectas. Acceso denegado."));
        }

        // Actualizar último login
        user.setLast_login(new Date());
        userRepository.save(user);

        // Generar token
        String token = jwtService.generateToken(username);

        return ResponseEntity.ok(Map.of(
                "token", token,
                "user", Map.of(
                        "id",       user.getId(),
                        "username", user.getUsername(),
                        "email",    user.getEmail()
                )
        ));
    }

    // ─── ME ───────────────────────────────────────────────────────────────────
    // GET /api/auth/me  (requiere JWT en el header)
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestHeader("Authorization") String authHeader) {
        String token    = authHeader.substring(7);
        String username = jwtService.extractUsername(token);

        return userRepository.findByUsername(username)
                .<ResponseEntity<?>>map(user -> ResponseEntity.ok(Map.of(
                        "id",       user.getId(),
                        "username", user.getUsername(),
                        "email",    user.getEmail()
                )))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Usuario no encontrado.")));
    }
}