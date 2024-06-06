package dev.atb.controller;

import dev.atb.dto.OcrDTO;
import dev.atb.Service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<OcrDTO> getOcrById(@PathVariable String id) {
        OcrDTO ocrDTO = ocrService.getOcrById(id);
        return ResponseEntity.ok(ocrDTO);
    }

    @GetMapping
    public ResponseEntity<List<OcrDTO>> getAllOcrEntities() {
        List<OcrDTO> ocrEntities = ocrService.getAllOcrEntities().stream().map(ocr -> ocrService.convertToDTO(ocr)).toList();
        return ResponseEntity.ok(ocrEntities);
    }

    @PostMapping("/perform")
    public ResponseEntity<OcrDTO> performOcr(@RequestParam("file") MultipartFile file) {
        OcrDTO ocrDTO = ocrService.performOcr(file);
        return ResponseEntity.ok(ocrDTO);
    }

    @PostMapping("/analyze")
    public ResponseEntity<OcrDTO> analyzeAndSaveImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("typeDocument") String typeDocument,
            @RequestParam("numeroCompteId") String numeroCompteId) {
        OcrDTO ocrDTO = ocrService.analyzeAndSaveImage(file, typeDocument, numeroCompteId);
        return ResponseEntity.ok(ocrDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOcrById(@PathVariable String id) {
        boolean deleted = ocrService.deleteOcrById(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
