package es.tfg.ismaelfeito.backstellarquery;

import es.tfg.ismaelfeito.backstellarquery.service.TestService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.core.token.TokenService;

@SpringBootApplication
public class BackStellarQueryApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackStellarQueryApplication.class, args);
    }

}
