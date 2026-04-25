package es.tfg.ismaelfeito.backstellarquery.service;

import es.tfg.ismaelfeito.backstellarquery.game.entity.Game;
import es.tfg.ismaelfeito.backstellarquery.game.repository.GameRepository;
import es.tfg.ismaelfeito.backstellarquery.users.entity.User;
import es.tfg.ismaelfeito.backstellarquery.users.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Scanner;

@Service
public class TestService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private JWTService jwtService;
    public Scanner sc =  new Scanner(System.in);
//    @PostConstruct
    public void testDatabases(){

        // USERS DB
        User user = new User();
        System.out.println("nombre: ");
        String n = sc.nextLine();
        user.setUsername(n);
        user.setPassword("1234dcrtfvygbuhnjkml,fctvygbuhnijmok,");
        System.out.printf("mail:");
        String m = sc.nextLine();
        user.setEmail(m);
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
