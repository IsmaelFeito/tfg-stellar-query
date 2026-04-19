package es.tfg.ismaelfeito.backstellarquery.users.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
@Table(name = "users")
public class User {

    @Id
    @Getter
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Getter
    private String username;

    @Getter
    @Setter
    private String email;

    @Setter
    @Getter
    @Column(name = "password_hash")
    private String password;

    @Getter
    @Setter
    private Date created_at;

    @Getter
    @Setter
    private Date last_login;
}

