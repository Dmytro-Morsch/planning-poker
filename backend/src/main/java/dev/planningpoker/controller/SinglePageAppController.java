package dev.planningpoker.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SinglePageAppController {

    @RequestMapping({"/", "/game/*"})
    public String index() {
        return "forward:/index.html";
    }
}
