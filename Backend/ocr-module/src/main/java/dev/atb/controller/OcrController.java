package dev.atb.controller;

import dev.atb.Service.FileValidationService;
import dev.atb.Service.OcrService;
import dev.atb.config.ResponseWrapper;
import dev.atb.dto.OcrDTO;
import dev.atb.models.Ocrs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/ocrs")
public class OcrController {

    private static final Logger logger = LoggerFactory.getLogger(OcrController.class);
    private static final long MAX_FILE_SIZE = 5242880; // 5 MB

    private final OcrService ocrService;
    private final FileValidationService fileValidationService;

    @Autowired
    public OcrController(OcrService ocrService, FileValidationService fileValidationService) {
        this.ocrService = ocrService;
        this.fileValidationService = fileValidationService;
    }

    @PostMapping("/perform")
    public ResponseEntity<ResponseWrapper<?>> performOcr(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            logger.warn("Empty file submitted for OCR.");
            return ResponseEntity.badRequest().body(
                    new ResponseWrapper<>(null, "File is empty.", false)
            );
        }

        if (!fileValidationService.validateFile(file)) {
            logger.warn("Invalid file type or size submitted for OCR.");
            return ResponseEntity.badRequest().body(
                    new ResponseWrapper<>(null, "Invalid file type or size.", false)
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            logger.warn("File size exceeds the maximum limit.");
            return ResponseEntity.badRequest().body(
                    new ResponseWrapper<>(null, "File size exceeds the maximum limit of 5 MB.", false)
            );
        }

        // Convert MultipartFile to File
        File convertedFile = null;
        try {
            logger.info("Performing OCR on file: {}", file.getOriginalFilename());

            // Convert MultipartFile to File
            convertedFile = convertMultipartFileToFile(file);

            // Perform OCR using the converted File
            OcrDTO ocrDTO = ocrService.performOcrWithTesseract(convertedFile);

            return ResponseEntity.ok(
                    new ResponseWrapper<>(ocrDTO, "OCR completed successfully.", true)
            );
        } catch (Exception e) {
            logger.error("Error performing OCR: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseWrapper<>(null, "Error performing OCR: " + e.getMessage(), false)
            );
        } finally {
            // Clean up temporary file
            if (convertedFile != null && convertedFile.exists()) {
                boolean deleted = convertedFile.delete();
                if (!deleted) {
                    logger.warn("Failed to delete temporary file: {}", convertedFile.getAbsolutePath());
                }
            }
        }
    }

    @PostMapping("/analyze")
    public ResponseEntity<ResponseWrapper<?>> analyzeAndSaveImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam("typeDocument") String typeDocument,
            @RequestParam("numeroCompteId") String numeroCompteId) {

        if (file.isEmpty()) {
            logger.warn("Empty file submitted for analysis.");
            return ResponseEntity.badRequest().body(
                    new ResponseWrapper<>(null, "File is empty.", false)
            );
        }
        if (typeDocument == null || typeDocument.isEmpty()) {
            logger.warn("Document type is missing.");
            return ResponseEntity.badRequest().body(
                    new ResponseWrapper<>(null, "Document type is required.", false)
            );
        }
        if (numeroCompteId == null || numeroCompteId.isEmpty()) {
            logger.warn("Account number ID is missing.");
            return ResponseEntity.badRequest().body(
                    new ResponseWrapper<>(null, "Account number ID is required.", false)
            );
        }

        if (!fileValidationService.validateFile(file)) {
            logger.warn("Invalid file type or size submitted for analysis.");
            return ResponseEntity.badRequest().body(
                    new ResponseWrapper<>(null, "Invalid file type or size.", false)
            );
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            logger.warn("File size exceeds the maximum limit.");
            return ResponseEntity.badRequest().body(
                    new ResponseWrapper<>(null, "File size exceeds the maximum limit of 5 MB.", false)
            );
        }

        File convertedFile = null;
        try {
            logger.info("Analyzing and saving image file: {}, document type: {}, account number ID: {}",
                    file.getOriginalFilename(), typeDocument, numeroCompteId);

            // Convert MultipartFile to File
            convertedFile = convertMultipartFileToFile(file);

            // Analyze and save image
            OcrDTO ocrDTO = ocrService.analyzeAndSaveImage(file, typeDocument, numeroCompteId);

            return ResponseEntity.ok(
                    new ResponseWrapper<>(ocrDTO, "Image analysis and save completed successfully.", true)
            );
        } catch (Exception e) {
            logger.error("Error analyzing and saving image: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseWrapper<>(null, "Error analyzing and saving image: " + e.getMessage(), false)
            );
        } finally {
            // Clean up temporary file
            if (convertedFile != null && convertedFile.exists()) {
                boolean deleted = convertedFile.delete();
                if (!deleted) {
                    logger.warn("Failed to delete temporary file: {}", convertedFile.getAbsolutePath());
                }
            }
        }
    }

    // Helper method to convert MultipartFile to File
    private File convertMultipartFileToFile(MultipartFile file) throws IOException {
        File convFile = File.createTempFile("uploaded_", "_" + file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        }
        return convFile;
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResponseWrapper<?>> getOcrById(@PathVariable String id) {
        try {
            OcrDTO ocrDTO = ocrService.getOcrById(id);
            if (ocrDTO == null) {
                logger.warn("OCR entity with ID {} not found.", id);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ResponseWrapper<>(null, "OCR entity not found for ID: " + id, false)
                );
            }
            return ResponseEntity.ok(
                    new ResponseWrapper<>(ocrDTO, "OCR entity retrieved successfully.", true)
            );
        } catch (Exception e) {
            logger.error("Error retrieving OCR with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseWrapper<>(null, "Error retrieving OCR: " + e.getMessage(), false)
            );
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllOcrEntities() {
        try {
            List<OcrDTO> ocrEntities = ocrService.getAllOcrEntities();
            if (ocrEntities.isEmpty()) {
                logger.warn("No OCR entities found.");
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.ok(
                    new ResponseWrapper<>(ocrEntities, "OCR entities retrieved successfully.", true)
            );
        } catch (Exception e) {
            logger.error("Error retrieving all OCR entities: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseWrapper<>(Collections.emptyList(), "Error retrieving OCR entities: " + e.getMessage(), false)
            );
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResponseWrapper<?>> updateOcr(
            @PathVariable String id,
            @RequestParam String newText,
            @RequestParam String documentType) {
        try {
            Ocrs updatedOcr = ocrService.updateOcr(id, newText, documentType);
            OcrDTO ocrDTO = ocrService.convertToOcrDTO(updatedOcr);
            return ResponseEntity.ok(
                    new ResponseWrapper<>(ocrDTO, "OCR entity updated successfully.", true)
            );
        } catch (Exception e) {
            logger.error("Error updating OCR with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseWrapper<>(null, "Error updating OCR: " + e.getMessage(), false)
            );
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseWrapper<?>> deleteOcrById(@PathVariable String id) {
        try {
            boolean deleted = ocrService.deleteOcr(id);
            if (deleted) {
                logger.info("OCR entity with ID {} deleted successfully.");
                return ResponseEntity.noContent().build();
            } else {
                logger.warn("OCR entity with ID {} not found.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                        new ResponseWrapper<>(null, "OCR entity not found for ID: " + id, false)
                );
            }
        } catch (Exception e) {
            logger.error("Error deleting OCR with ID {}: {}", id, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    new ResponseWrapper<>(null, "Error deleting OCR: " + e.getMessage(), false)
            );
        }
    }
}
