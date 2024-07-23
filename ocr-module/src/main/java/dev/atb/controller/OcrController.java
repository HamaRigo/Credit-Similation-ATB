package dev.atb.controller;

import dev.atb.Service.OcrService;

import dev.atb.dto.OcrDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ocr")
public class OcrController {

    @Autowired
    private OcrService ocrService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getOcrById(@PathVariable String id) {
        try {
            OcrDTO ocrDTO = ocrService.getOcrById(id);
            return ResponseEntity.ok(ocrDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving OCR: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<OcrDTO>> getAllOcrEntities() {
        try {
            List<OcrDTO> ocrEntities = ocrService.getAllOcrEntities();
            return ResponseEntity.ok(ocrEntities);
        } catch (Exception e) {
            return null ;
        }
    }

    @PostMapping("/perform")
    public ResponseEntity<?> performOcr(@RequestParam("file") MultipartFile file) {
        try {
            OcrDTO ocrDTO = ocrService.performOcr(file);
            return ResponseEntity.ok(ocrDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error performing OCR: " + e.getMessage());
        }
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeAndSaveImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("typeDocument") String typeDocument,
            @RequestParam("numeroCompteId") String numeroCompteId) {
        try {
            OcrDTO ocrDTO = ocrService.analyzeAndSaveImage(file, typeDocument, numeroCompteId);
            return ResponseEntity.ok(ocrDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error analyzing and saving image: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOcrById(@PathVariable String id) {
        try {
            boolean deleted = ocrService.deleteOcrById(id);
            if (deleted) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting OCR: " + e.getMessage());
        }
    }
}
