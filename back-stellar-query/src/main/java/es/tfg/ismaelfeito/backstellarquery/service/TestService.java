package es.tfg.ismaelfeito.backstellarquery.service;

import es.tfg.ismaelfeito.backstellarquery.game.entity.Game;
import es.tfg.ismaelfeito.backstellarquery.game.repository.GameRepository;
import es.tfg.ismaelfeito.backstellarquery.users.entity.User;
import es.tfg.ismaelfeito.backstellarquery.users.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TestService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    public void testDatabases(){

        // USERS DB
        User user = new User();
        user.setUsername("paco");
        user.setPassword("1234");
        userRepository.save(user);
        System.out.println(user.getUsername()+" "+user.getPassword());

        // GAME DB
        Game game = new Game();
        game.setName("test game");
        gameRepository.save(game);
        System.out.println(game.getName());
    }

}
