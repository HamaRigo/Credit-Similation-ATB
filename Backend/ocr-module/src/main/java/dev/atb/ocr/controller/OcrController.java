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
 * Controller for OCR operations such as image uploading, analysis, and data retrieval.
 */
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:9090"})
@RestController
@RequestMapping("/all")
public class OcrController {

    private static final Logger logger = LoggerFactory.getLogger(OcrController.class);
    private final OcrService ocrService;

    @Autowired
    public OcrController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

    /**
     * Uploads and analyzes an image file for OCR, performs fraud detection, and saves the result.
     *
     * @param file           the image file to be analyzed
     * @param typeDocument   the type of the document (e.g., cheque, effet)
     * @param numeroCompteId the account number associated with the document
     * @return the OCR analysis result
     */
    @PostMapping("/upload")
    public CompletableFuture<ResponseEntity<OcrDTO>> uploadImageAsync(
            @RequestParam("file") MultipartFile file,
            @RequestParam("typeDocument") @NotEmpty String typeDocument,
            @RequestParam("numeroCompteId") @NotEmpty String numeroCompteId) {

        return CompletableFuture.supplyAsync(() -> {
            validateFile(file);
        try {
            byte[] fileBytes = file.getBytes();
            String signatureBase64 = ocrService.generateSignatureBase64(fileBytes);

            OcrDTO ocrDTO = ocrService.uploadAndAnalyzeImage(file, typeDocument, numeroCompteId, signatureBase64);
            return ResponseEntity.status(HttpStatus.CREATED).body(ocrDTO);
        } catch (OcrProcessingException e) {
            return handleException("OCR processing failed", e);
        } catch (IOException e) {
            return handleException("File handling error", e);
        } catch (Exception e) {
            return handleException("Unknown error during image upload", e);
        }
        });
    }

    /**
     * Uploads an image file for OCR analysis and returns the OCR result along with a preview image in Base64 format.
     *
     * @param file         the image file to be uploaded
     * @param typeDocument the type of the document (e.g., cheque, facture)
     * @return the OCR result along with the preview image in Base64 format
     */
    @PostMapping("/upload-preview")
    public ResponseEntity<OcrDTO> uploadImageAndPreview(@RequestParam("file") MultipartFile file,
            @RequestParam("typeDocument") @NotEmpty String typeDocument) {

        validateFile(file);
        try {
            OcrDTO ocrDTO = ocrService.uploadImageAndPreview(file, typeDocument);
            return ResponseEntity.status(HttpStatus.CREATED).body(ocrDTO);
        } catch (OcrProcessingException e) {
            return handleException("OCR processing failed", e);
        } catch (Exception e) {
            return handleException("Unknown error during image upload", e);
        }
    }
    /**
     * Retrieves a specific OCR record by ID.
     *
     * @param id the OCR record ID
     * @return the OCR record, if found
     */
    @GetMapping("/{id}")
    public ResponseEntity<OcrDTO> getOcrById(@PathVariable String id) {
        OcrDTO ocrDTO = ocrService.getOcrById(id);
        return ocrDTO != null ? ResponseEntity.ok(ocrDTO) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Retrieves all OCR records.
     *
     * @return list of all OCR records
     */
    @GetMapping("/all")
    public ResponseEntity<List<OcrDTO>> getAllOcrEntities() {
        List<OcrDTO> ocrList = ocrService.getAllOcrEntities();
        return ResponseEntity.ok(ocrList);
    }

    /**
     * Deletes a specific OCR record by ID.
     *
     * @param id the OCR record ID
     * @return a response indicating success or failure
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOcr(@PathVariable String id) {
        boolean deleted = ocrService.deleteOcr(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    /**
     * Updates an existing OCR record.
     *
     * @param id           the OCR record ID
     * @param newText      the new OCR text
     * @param documentType the updated document type
     * @return the updated OCR record
     */
    @PutMapping("/{id}")
    public ResponseEntity<OcrDTO> updateOcr(@PathVariable String id,
                                            @RequestParam String newText,
                                            @RequestParam String documentType) {
        try {
            OcrDTO updatedOcr = ocrService.updateOcr(id, newText, documentType);
            return updatedOcr != null ? ResponseEntity.ok(updatedOcr) : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return handleException("Error updating OCR record", e);
        }
    }

    /**
     * Generates a signature in Base64 format from an uploaded file.
     *
     * @param file the image file
     * @return the Base64 encoded signature
     */
    @PostMapping("/signature")
    public ResponseEntity<String> generateSignature(@RequestParam("file") MultipartFile file) {
        validateFile(file);
        try {
            byte[] fileBytes = file.getBytes();
            String signatureBase64 = ocrService.generateSignatureBase64(fileBytes);
            return ResponseEntity.ok(signatureBase64);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating signature: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unknown error generating signature");
        }
    }

    /**
     * Validates that the uploaded file is not null or empty.
     *
     * @param file the uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Uploaded file is empty or null.");
        }
    }

    /**
     * Handles exceptions with a standardized error message.
     *
     * @param message the custom error message
     * @param e       the caught exception
     * @return a ResponseEntity with error details
     */
    private ResponseEntity<OcrDTO> handleException(String message, Exception e) {
        logger.error(message, e);
        OcrDTO errorResponse = new OcrDTO();
        errorResponse.setError(message + ": " + e.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
