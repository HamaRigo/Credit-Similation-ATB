package dev.atb.controller;

import dev.atb.Service.OcrService;
import dev.atb.dto.OcrDTO;
import dev.atb.models.Ocr;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/ocr")
public class OcrController {


    @Autowired
    private OcrService ocrService;

    @PostMapping("/analyze")
    public ResponseEntity<OcrDTO> analyzeImage(@RequestParam("file") MultipartFile file,
                                               @RequestParam("typeDocument") String typeDocument,
                                               @RequestParam("numeroCompte") String numeroCompte) {
        // Check if file is empty
        if (file.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        // Perform OCR analysis and save the result
        OcrDTO ocrResult = ocrService.analyzeAndSaveImage(file, typeDocument, numeroCompte);

        return new ResponseEntity<>(ocrResult, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcrDTO> getOcrById(@PathVariable("id") String id) {
        OcrDTO ocr = ocrService.getOcrById(id);
        if (ocr != null) {
            return new ResponseEntity<>(ocr, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOcrById(@PathVariable("id") String id) {
        boolean deleted = ocrService.deleteOcrById(id);
        if (deleted) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}