package es.tfg.ismaelfeito.backstellarquery.controller;

import es.tfg.ismaelfeito.backstellarquery.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private TestService testService;

    @GetMapping
    public String test() {
        testService.testDatabases();
        return "OK";
    }
}
