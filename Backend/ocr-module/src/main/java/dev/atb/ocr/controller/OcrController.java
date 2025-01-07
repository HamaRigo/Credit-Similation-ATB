package dev.atb.ocr.controller;

import dev.atb.dto.OcrDTO;
import dev.atb.ocr.Service.OcrService;
import dev.atb.ocr.config.ApiResponse;
import dev.atb.ocr.exceptions.OcrProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

import static org.apache.kafka.common.requests.DeleteAclsResponse.log;

@RestController
@RequestMapping("/ocrs")
public class OcrController {

    private final OcrService ocrService;

    @Autowired
    public OcrController(OcrService ocrService) {
        this.ocrService = ocrService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<OcrDTO>> uploadImage(
            @RequestParam("file") MultipartFile file,
                                              @RequestParam("typeDocument") String typeDocument,
                                              @RequestParam(value = "numeroCompteId", required = false) String numeroCompteId) {
        try {
            // Input validation
            if (file.isEmpty()) {
                throw new IllegalArgumentException("File must not be empty");
            }
            if (typeDocument == null || typeDocument.trim().isEmpty()) {
                throw new IllegalArgumentException("Document type is required");
            }

            // Process the OCR request
            OcrDTO ocrDTO = ocrService.analyzeAndSaveImage(file, typeDocument, numeroCompteId);
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(new ApiResponse<>("Image processed successfully", ocrDTO));

        } catch (IllegalArgumentException e) {
            log.warn("Validation error: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse<>(e.getMessage(), null));
        } catch (OcrProcessingException e) {
            log.error("Error processing OCR: {}", e.getMessage(), e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("Error processing image", null));
        } catch (Exception e) {
            log.error("Unexpected error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>("An unexpected error occurred", null));
        }
    }
}
