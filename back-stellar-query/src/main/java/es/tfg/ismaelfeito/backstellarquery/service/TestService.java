package es.tfg.ismaelfeito.backstellarquery.service;

import es.tfg.ismaelfeito.backstellarquery.game.entity.Game;
import es.tfg.ismaelfeito.backstellarquery.game.repository.GameRepository;
import es.tfg.ismaelfeito.backstellarquery.users.entity.User;
import es.tfg.ismaelfeito.backstellarquery.users.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private JWTService jwtService;

    @PostConstruct
    public void testDatabases(){

        // USERS DB
        User user = new User();
        user.setUsername("paco");
        user.setPassword("1234");
        user.setEmail("paco@email.com");
        userRepository.save(user);
        String uname = user.getUsername();
        System.out.println("USERNAME adsfbgfwrabegds r\n\n\n\n\n"+uname+" "+user.getPassword());

        // GAME DB
        Game game = new Game();
        game.setName("test game");
        gameRepository.save(game);
        System.out.println(game.getName());

        String token = jwtService.generateToken(uname);
        System.out.println(token+" :  \n\nesto es el token\n\n\n\n");

        String claimedUname = jwtService.extractUsername(token);
        System.out.println(claimedUname+"\n\n");

        System.out.println(jwtService.isValid(token));
    }

}
