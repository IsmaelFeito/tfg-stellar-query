package es.tfg.ismaelfeito.backstellarquery.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JWTService {

    // Leídos desde application.properties — nunca hardcodeados en el código
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration;

    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    /**
     * Genera un JWT firmado con HMAC-SHA256.
     * El subject es el username del usuario.
     * Expira según jwt.expiration (por defecto 1 hora = 3600000 ms).
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getKey())
                .compact();
    }

    /**
     * Parsea el token y devuelve sus Claims (payload).
     * Lanza JwtException si la firma es inválida o el token está expirado.
     */
    private Claims parseToken(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /** Extrae el username (subject) del token. */
    public String extractUsername(String token) {
        return parseToken(token).getSubject();
    }

    /** Devuelve true si el token tiene firma válida y no ha expirado. */
    public boolean isValid(String token) {
        try {
            parseToken(token);
            return true;
        } catch (ExpiredJwtException e) {
            return false;   // token caducado
        } catch (JwtException e) {
            return false;   // firma inválida u otro problema
        }
    }
}
