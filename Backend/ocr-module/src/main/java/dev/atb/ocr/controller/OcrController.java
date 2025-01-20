package dev.atb.ocr.controller;

import dev.atb.dto.OcrDTO;
import dev.atb.ocr.Service.OcrService;
import dev.atb.ocr.exceptions.OcrProcessingException;
import jakarta.validation.constraints.NotEmpty;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Controller for OCR operations like image upload, analysis, and data retrieval.
 */
@RestController
@RequestMapping("/ocr")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9090"})
public class OcrController {

    private static final Logger logger = LoggerFactory.getLogger(OcrController.class);
    private final OcrService ocrService;

    @Autowired
    public OcrController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

    /**
     * Uploads and analyzes an image for OCR, including fraud detection.
     */
    @PostMapping("/upload")
    public CompletableFuture<ResponseEntity<OcrDTO>> uploadImageAsync(
            @RequestParam("file") MultipartFile file,
            @RequestParam("typeDocument") @NotEmpty String typeDocument,
            @RequestParam("numeroCompteId") @NotEmpty String numeroCompteId) {

        logger.info("Received file upload request. Document Type: {}, Account ID: {}", typeDocument, numeroCompteId);

        return CompletableFuture.supplyAsync(() -> {
            validateFile(file);
            try {
                byte[] fileBytes = file.getBytes();
                String signatureBase64 = ocrService.generateSignatureBase64(fileBytes);
                OcrDTO ocrDTO = ocrService.uploadAndAnalyzeImage(file, typeDocument, numeroCompteId, signatureBase64);
                logger.info("OCR processing completed successfully for Account ID: {}", numeroCompteId);
                return ResponseEntity.status(HttpStatus.CREATED).body(ocrDTO);
            } catch (Exception e) {
                return handleException("Error during OCR processing", e);
            }
        });
    }

    /**
     * Uploads an image and provides OCR preview data.
     */
    @PostMapping("/upload-preview")
    public ResponseEntity<OcrDTO> uploadImageAndPreview(@RequestParam("file") MultipartFile file,
                                                        @RequestParam("typeDocument") @NotEmpty String typeDocument) {
        validateFile(file);
        try {
            OcrDTO ocrDTO = ocrService.uploadImageAndPreview(file, typeDocument);
            return ResponseEntity.status(HttpStatus.CREATED).body(ocrDTO);
        } catch (Exception e) {
            return handleException("Error during preview generation", e);
        }
    }

    /**
     * Retrieves a specific OCR record by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<OcrDTO> getOcrById(@PathVariable String id) {
        logger.info("Fetching OCR record for ID: {}", id);
        OcrDTO ocrDTO = ocrService.getOcrById(id);
        return ocrDTO != null
                ? ResponseEntity.ok(ocrDTO)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Retrieves all OCR records.
     */
    @GetMapping("/all")
    public ResponseEntity<List<OcrDTO>> getAllOcrEntities() {
        logger.info("Fetching all OCR records");
        List<OcrDTO> ocrList = ocrService.getAllOcrEntities();
        return ResponseEntity.ok(ocrList);
    }

    /**
     * Deletes a specific OCR record by ID.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOcr(@PathVariable String id) {
        logger.info("Deleting OCR record for ID: {}", id);
        boolean deleted = ocrService.deleteOcr(id);
        return deleted
                ? ResponseEntity.noContent().build()
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Updates an OCR record.
     */
    @PutMapping("/{id}")
    public ResponseEntity<OcrDTO> updateOcr(@PathVariable String id,
                                            @RequestParam String newText,
                                            @RequestParam String documentType) {
        logger.info("Updating OCR record ID: {}", id);
        try {
            OcrDTO updatedOcr = ocrService.updateOcr(id, newText, documentType);
            return updatedOcr != null
                    ? ResponseEntity.ok(updatedOcr)
                    : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return handleException("Error updating OCR record", e);
        }
    }

    /**
     * Generates a Base64 signature from a file.
     */
    @PostMapping("/signature")
    public ResponseEntity<String> generateSignature(@RequestParam("file") MultipartFile file) {
        validateFile(file);
        try {
            byte[] fileBytes = file.getBytes();
            String signatureBase64 = ocrService.generateSignatureBase64(fileBytes);
            return ResponseEntity.ok(signatureBase64);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating signature: " + e.getMessage());
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty or null.");
        }
    }

    private ResponseEntity<OcrDTO> handleException(String message, Exception e) {
        logger.error(message, e);
        OcrDTO errorResponse = new OcrDTO();
        errorResponse.setError(message + ": " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}