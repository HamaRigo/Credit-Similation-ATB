package dev.atb.credit.controller;

import dev.atb.dto.CreditDTO;
import dev.atb.dto.CreditModelDTO;
import dev.atb.credit.Service.CreditService;
import dev.atb.models.Credit;
import dev.atb.models.CreditModel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
@RestController
@RequestMapping("/credits")
public class CreditController {
    @Autowired
    private CreditService creditService;

    @GetMapping
    public ResponseEntity<List<CreditDTO>> getAllCredits() {
        return new ResponseEntity<>(creditService.getAllCredits(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCreditById(@PathVariable final Long id) {
        try {
            return new ResponseEntity<>(creditService.getCreditById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<CreditDTO> createCredit(@RequestBody final Credit credit) {
        try {
            return new ResponseEntity<>(creditService.createCredit(credit), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<CreditDTO> updateCredit(@RequestBody final Credit credit) {
        try {
            return new ResponseEntity<>(creditService.updateCredit(credit), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredit(@PathVariable final Long id) {
        try {
            creditService.deleteCredit(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/models")
    public ResponseEntity<List<CreditModelDTO>> getAllCreditModels() {
        return new ResponseEntity<>(creditService.getAllCreditModels(), HttpStatus.OK);
    }

    @GetMapping("/models/{id}")
    public ResponseEntity<CreditModelDTO> getCreditModelById(@PathVariable final Long id) {
        try {
            return new ResponseEntity<>(creditService.getCreditModelById(id), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/models")
    public ResponseEntity<CreditModelDTO> createCreditModel(@RequestBody final CreditModel creditModel) {
        try {
            return new ResponseEntity<>(creditService.createCreditModel(creditModel), HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/models")
    public ResponseEntity<CreditModelDTO> updateCreditModel(@RequestBody final CreditModel creditModel) {
        try {
            return new ResponseEntity<>(creditService.updateCreditModel(creditModel), HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/models/{id}")
    public ResponseEntity<Void> deleteCreditModel(@PathVariable final Long id) {
        try {
            creditService.deleteCreditModel(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
