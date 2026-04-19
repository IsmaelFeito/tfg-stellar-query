package es.tfg.ismaelfeito.backstellarquery.service;


import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JWTService {

//    @Value("${jwt.secret}")
    private String secret = "mysupersecretkeymysupersecretkey123";

//    @Value("${jwt.expiration}")
    private long expitarion = 3600000;



    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public  String generateToken(String username){
        SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());

        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expitarion))
                .signWith(getKey())
                .compact();
    }

//    Extracts the body of the token where is the Users username
//    Claims -> pairs key: value (7 standard types)
    private Claims parseToken(String token) {
        SecretKey secretKey = Keys.hmacShaKeyFor(secret.getBytes());

        return  Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extractUsername(String token){
        return parseToken(token).getSubject();
    }

    public boolean isValid(String token){
        try {
            Claims claims = parseToken(token);
            return true;
        } catch (ExpiredJwtException e){ //Expired Token
            return false;
        } catch (JwtException e){ //Invalid sign
            return false;
        }
    }
}
