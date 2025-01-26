package dev.atb.compte.controller;

import dev.atb.compte.services.CompteService;
import dev.atb.dto.CompteCountByStatusDTO;
import dev.atb.dto.CompteCountByTypeDTO;
import dev.atb.dto.CompteDTO;
import dev.atb.models.CompteCourant;
import dev.atb.models.CompteEpargne;
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

    @GetMapping("/countByType")
    public ResponseEntity<List<CompteCountByTypeDTO>> getComptesCountByType() {
        return new ResponseEntity<>(compteService.findComptesCountByType(), HttpStatus.OK);
    }

    @GetMapping("/countByStatus")
    public ResponseEntity<List<CompteCountByStatusDTO>> getComptesCountByStatus() {
        return new ResponseEntity<>(compteService.findComptesCountByStatus(), HttpStatus.OK);
    }

    @GetMapping("/current")
    public ResponseEntity<List<CompteDTO>> getAllCurrentComptes() {
        return new ResponseEntity<>(compteService.findAllCurrentComptes(), HttpStatus.OK);
    }

    @GetMapping("/saving")
    public ResponseEntity<List<CompteDTO>> getAllSavingComptes() {
        return new ResponseEntity<>(compteService.findAllSavingComptes(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCompteById(@PathVariable final Long id) {
        try {
            return new ResponseEntity<>(compteService.findById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/exists")
    public ResponseEntity<Boolean> compteAlreadyExists(@RequestParam final String numeroCompte) {
        return new ResponseEntity<>(compteService.compteAlreadyExists(numeroCompte), HttpStatus.OK);
    }

    @PostMapping("/current")
    public ResponseEntity<CompteDTO> createCurrentCompte(@RequestBody final CompteCourant compte) {
        try {
            return new ResponseEntity<>(compteService.createCurrentCompte(compte), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/saving")
    public ResponseEntity<CompteDTO> createSavingCompte(@RequestBody final CompteEpargne compte) {
        try {
            return new ResponseEntity<>(compteService.createSavingCompte(compte), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/current")
    public ResponseEntity<CompteDTO> updateCurrentCompte(@RequestBody final CompteCourant compte) {
        try {
            return new ResponseEntity<>(compteService.updateCurrentCompte(compte), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/saving")
    public ResponseEntity<CompteDTO> updateSavingCompte(@RequestBody final CompteEpargne compte) {
        try {
            return new ResponseEntity<>(compteService.updateSavingCompte(compte), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompte(@PathVariable final Long id) {
        try {
            compteService.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
