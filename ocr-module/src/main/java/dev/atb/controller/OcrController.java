package dev.atb.controller;

import dev.atb.Service.OcrService;
import dev.atb.dto.OcrDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/ocrs")
public class OcrController {

    private static final Logger logger = LoggerFactory.getLogger(OcrController.class);

    @Autowired
    private OcrService ocrService;

    /**
     * Retrieves an OCR entity by its ID.
     *
     * @param id the ID of the OCR entity
     * @return the OCR entity with the specified ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOcrById(@PathVariable String id) {
        try {
            OcrDTO ocrDTO = ocrService.getOcrById(id);
            return ResponseEntity.ok(ocrDTO);
        } catch (Exception e) {
            logger.error("Error retrieving OCR with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving OCR: " + e.getMessage());
        }
    }

    /**
     * Retrieves all OCR entities.
     *
     * @return a list of all OCR entities
     */
    @GetMapping
    public ResponseEntity<List<OcrDTO>> getAllOcrEntities() {
        try {
            List<OcrDTO> ocrEntities = ocrService.getAllOcrEntities();
            return ResponseEntity.ok(ocrEntities);
        } catch (Exception e) {
            logger.error("Error retrieving all OCR entities: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList()); // Return an empty list on error
        }
    }



    /**
     * Performs OCR on a provided image file.
     *
     * @param file the image file to perform OCR on
     * @return the result of the OCR operation
     */
    @PostMapping("/perform")
    public ResponseEntity<?> performOcr(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            logger.info("Performing OCR on file: {}", file.getOriginalFilename());

            OcrDTO ocrDTO = ocrService.performOcr(file);
            return ResponseEntity.ok(ocrDTO);
        } catch (Exception e) {
            logger.error("Error performing OCR: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error performing OCR: " + e.getMessage());
        }
    }

    /**
     * Analyzes and saves an image file.
     *
     * @param file the image file to analyze
     * @param typeDocument the type of document
     * @param numeroCompteId the ID of the associated Compte entity
     * @return the result of the analysis and save operation
     */
    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeAndSaveImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("typeDocument") String typeDocument,
            @RequestParam("numeroCompteId") String numeroCompteId) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("File is empty");
            }

            logger.info("Analyzing and saving image file: {} with typeDocument: {} and numeroCompteId: {}",
                    file.getOriginalFilename(), typeDocument, numeroCompteId);

            OcrDTO ocrDTO = ocrService.analyzeAndSaveImage(file, typeDocument, numeroCompteId);
            return ResponseEntity.ok(ocrDTO);
        } catch (Exception e) {
            logger.error("Error analyzing and saving image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error analyzing and saving image: " + e.getMessage());
        }
    }

    /**
     * Deletes an OCR entity by its ID.
     *
     * @param id the ID of the OCR entity to delete
     * @return a response indicating the result of the delete operation
     */
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
            logger.error("Error deleting OCR with ID {}: {}", id, e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting OCR: " + e.getMessage());
        }
    }
}
