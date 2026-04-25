package es.tfg.ismaelfeito.backstellarquery.config;

import es.tfg.ismaelfeito.backstellarquery.service.JWTService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JWTService jwtService;

    // ─── Filtro JWT ────────────────────────────────────────────────────────────
    // Lee el header Authorization: Bearer <token>, lo valida y mete el usuario
    // en el SecurityContext para que los endpoints protegidos lo reconozcan.
    public class JwtAuthFilter extends OncePerRequestFilter {
        @Override
        protected void doFilterInternal(HttpServletRequest req,
                                        HttpServletResponse res,
                                        FilterChain chain) throws ServletException, IOException {
            String header = req.getHeader("Authorization");
            if (header != null && header.startsWith("Bearer ")) {
                String token = header.substring(7);
                if (jwtService.isValid(token)) {
                    String username = jwtService.extractUsername(token);
                    var auth = new org.springframework.security.authentication
                            .UsernamePasswordAuthenticationToken(username, null, List.of());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
            chain.doFilter(req, res);
        }
    }

    // ─── Cadena de seguridad principal ─────────────────────────────────────────
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Desactivar CSRF (no usamos sesiones de servidor, usamos JWT)
                .csrf(AbstractHttpConfigurer::disable)

                // 2. Configurar CORS (permite peticiones desde el front en Vite)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 3. Sin sesión de servidor — cada petición se autentica con el token
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // 4. Desactivar el formulario de login por defecto de Spring Security
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                // 5. Reglas de autorización
                .authorizeHttpRequests(auth -> auth
                        // Rutas públicas: registro y login
                        .requestMatchers("/api/auth/**").permitAll()
                        // Ruta de test (puedes quitarla en producción)
                        .requestMatchers("/test").permitAll()
                        // Todo lo demás requiere JWT válido
                        .anyRequest().authenticated()
                )

                // 6. Añadir el filtro JWT antes del filtro de usuario/contraseña estándar
                .addFilterBefore(new JwtAuthFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ─── Configuración CORS ────────────────────────────────────────────────────
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Orígenes permitidos (Vite dev server)
        config.setAllowedOrigins(List.of(
                "http://localhost:5173",
                "http://localhost:5174"   // Vite a veces usa 5174 si 5173 está ocupado
        ));

        // Métodos HTTP permitidos
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Headers que puede enviar el front
        config.setAllowedHeaders(List.of("*"));

        // Permitir cookies/Authorization header
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}