package dev.atb.ocr.controller;

import dev.atb.dto.OcrDTO;
import dev.atb.ocr.Service.OcrService;
import dev.atb.ocr.exceptions.OcrProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/ocrs")
public class OcrController {

    private final OcrService ocrService;

    @Autowired
    public OcrController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

    @PostMapping("/upload")
    public ResponseEntity<OcrDTO> uploadImage(@RequestParam("file") MultipartFile file,
                                              @RequestParam("typeDocument") String typeDocument,
                                              @RequestParam(value = "numeroCompteId", required = false) String numeroCompteId) {
        try {
            OcrDTO ocrDTO = ocrService.analyzeAndSaveImage(file, typeDocument, numeroCompteId);
            return ResponseEntity.status(HttpStatus.CREATED).body(ocrDTO);
        } catch (OcrProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OcrDTO("Error processing image: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OcrDTO("Unexpected error: " + e.getMessage()));
        }
    }

    @PostMapping("/analyze")
    public ResponseEntity<OcrDTO> analyzeImage(@RequestParam("file") MultipartFile file,
                                               @RequestParam(value = "typeDocument", required = false) String typeDocument,
                                               @RequestParam(value = "numeroCompteId", required = false) String numeroCompteId) {
        try {
            OcrDTO ocrDTO = ocrService.analyzeAndSaveImage(file, typeDocument, numeroCompteId);
            return ResponseEntity.ok(ocrDTO);
        } catch (OcrProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OcrDTO("Error processing image: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OcrDTO("Unexpected error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OcrDTO> getOcrById(@PathVariable String id) {
        OcrDTO ocrDTO = ocrService.getOcrById(id);
        return ocrDTO != null ? ResponseEntity.ok(ocrDTO) : ResponseEntity.notFound().build();
    }

    @GetMapping
    public ResponseEntity<List<OcrDTO>> getAllOcrEntities() {
        List<OcrDTO> ocrList = ocrService.getAllOcrEntities();
        return ResponseEntity.ok(ocrList);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOcr(@PathVariable String id) {
        boolean deleted = ocrService.deleteOcr(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<OcrDTO> updateOcr(@PathVariable String id,
                                            @RequestParam String newText,
                                            @RequestParam String documentType) {
        try {
            OcrDTO updatedOcr = ocrService.updateOcr(id, newText, documentType);
            return ResponseEntity.ok(updatedOcr);
        } catch (OcrProcessingException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OcrDTO("Error updating OCR: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new OcrDTO("Unexpected error: " + e.getMessage()));
        }
    }
}
