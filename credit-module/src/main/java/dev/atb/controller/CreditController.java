package dev.atb.controller;

import dev.atb.dto.CreditDTO;
import dev.atb.dto.CreditModelDTO;
import dev.atb.Service.CreditService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/credits")
public class CreditController {

    @Autowired
    private CreditService creditService;

    // CRUD operations for CreditDTO

    @GetMapping("/{id}")
    public ResponseEntity<CreditDTO> getCreditById(@PathVariable Long id) {
        CreditDTO creditDTO = creditService.getCreditById(id);
        return new ResponseEntity<>(creditDTO, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<List<CreditDTO>> getAllCredits() {
        List<CreditDTO> creditDTOs = creditService.getAllCredits();
        return new ResponseEntity<>(creditDTOs, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<CreditDTO> createCredit(@RequestBody CreditDTO creditDTO) {
        CreditDTO createdCreditDTO = creditService.createCredit(creditDTO);
        return new ResponseEntity<>(createdCreditDTO, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CreditDTO> updateCredit(@PathVariable Long id, @RequestBody CreditDTO creditDTO) {
        CreditDTO updatedCreditDTO = creditService.updateCredit(id, creditDTO);
        return new ResponseEntity<>(updatedCreditDTO, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCredit(@PathVariable Long id) {
        creditService.deleteCredit(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // CRUD operations for CreditModelDTO

    @GetMapping("/models/{id}")
    public ResponseEntity<CreditModelDTO> getCreditModelById(@PathVariable Long id) {
        CreditModelDTO creditModelDTO = creditService.getCreditModelById(id);
        return new ResponseEntity<>(creditModelDTO, HttpStatus.OK);
    }

    @GetMapping("/models")
    public ResponseEntity<List<CreditModelDTO>> getAllCreditModels() {
        List<CreditModelDTO> creditModelDTOs = creditService.getAllCreditModels();
        return new ResponseEntity<>(creditModelDTOs, HttpStatus.OK);
    }

    @PostMapping("/models")
    public ResponseEntity<CreditModelDTO> createCreditModel(@RequestBody CreditModelDTO creditModelDTO) {
        CreditModelDTO createdCreditModelDTO = creditService.createCreditModel(creditModelDTO);
        return new ResponseEntity<>(createdCreditModelDTO, HttpStatus.CREATED);
    }

    @PutMapping("/models/{id}")
    public ResponseEntity<CreditModelDTO> updateCreditModel(@PathVariable Long id, @RequestBody CreditModelDTO creditModelDTO) {
        CreditModelDTO updatedCreditModelDTO = creditService.updateCreditModel(id, creditModelDTO);
        return new ResponseEntity<>(updatedCreditModelDTO, HttpStatus.OK);
    }

    @DeleteMapping("/models/{id}")
    public ResponseEntity<Void> deleteCreditModel(@PathVariable Long id) {
        creditService.deleteCreditModel(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
