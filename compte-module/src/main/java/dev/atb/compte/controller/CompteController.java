package dev.atb.compte.controller;

import dev.atb.compte.services.CompteService;
import dev.atb.dto.CompteDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/comptes")
public class CompteController {

    @Autowired
    private CompteService compteService;

    @GetMapping("/{id}")
    public CompteDTO getCompteById(@PathVariable String id) {
        return compteService.findById(id);
    }

    @GetMapping
    public List<CompteDTO> getAllComptes() {
        return compteService.findAll();
    }

    @PostMapping("/add")
    public CompteDTO createCompte(@RequestBody CompteDTO compteDTO) {
        return compteService.save(compteDTO);
    }

    @PutMapping("/{id}")
    public CompteDTO updateCompte(@PathVariable String id, @RequestBody CompteDTO compteDTO) {
        compteDTO.setNumeroCompte(id);
        return compteService.save(compteDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteCompte(@PathVariable String id) {
        compteService.deleteById(id);
    }
}
