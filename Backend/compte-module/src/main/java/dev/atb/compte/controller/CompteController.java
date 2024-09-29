package dev.atb.compte.controller;

import dev.atb.compte.services.CompteService;
import dev.atb.dto.CompteDTO;
import dev.atb.models.Compte;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/comptes")
public class CompteController {
    @Autowired
    private CompteService compteService;

    @GetMapping
    public ResponseEntity<List<CompteDTO>> getAllComptes() {
        return new ResponseEntity<>(compteService.findAll(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompteById(@PathVariable final String id) {
        try {
            return new ResponseEntity<>(compteService.findById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<CompteDTO> createCompte(@RequestBody final Compte compte) {
        try {
            return new ResponseEntity<>(compteService.createCompte(compte), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<CompteDTO> updateCompte(@RequestBody final Compte compte) {
        try {
            return new ResponseEntity<>(compteService.updateCompte(compte), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompte(@PathVariable final String id) {
        try {
            compteService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
