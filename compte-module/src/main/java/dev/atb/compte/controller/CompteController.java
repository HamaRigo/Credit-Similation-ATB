package dev.atb.compte.controller;
import dev.atb.compte.services.CompteService;
import dev.atb.models.Compte;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/comptes")
public class CompteController {

    @Autowired
    private CompteService compteService;

    @GetMapping("/{id}")
    public Compte getCompteById(@PathVariable String id) {
        return compteService.findById(id);
    }

    @GetMapping
    public List<Compte> getAllComptes() {
        return compteService.findAll();
    }

    @PostMapping
    public Compte createCompte(@RequestBody Compte compte) {
        return compteService.save(compte);
    }

    @PutMapping("/{id}")
    public Compte updateCompte(@PathVariable String numeroCompte, @RequestBody Compte compte) {
        compte.setNumeroCompte(numeroCompte);
        return compteService.save(compte);
    }

    @DeleteMapping("/{id}")
    public void deleteCompte(@PathVariable String id) {
        compteService.deleteById(id);
    }
}
