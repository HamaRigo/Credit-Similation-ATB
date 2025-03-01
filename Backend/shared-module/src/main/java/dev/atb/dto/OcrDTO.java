package dev.atb.dto;

import lombok.*;

/**
 * Data Transfer Object for OCR processing results.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "image")
public class OcrDTO {
    private Long id;
    private String typeDocument;
    private String resultatsReconnaissance;
    private boolean fraud;
    private String image; // Base64 encoded image
    private String modelUsed = "defaultModel"; // Default model
    private String errorMessage; // Error details
    private double confidenceScore = 0.0; // Default confidence score


    public boolean isFraud() {
        return fraud;
    }

    public void setFraud(boolean fraud) {
        this.fraud = fraud;
    }

    public String getResultatsReconnaissance() {
        return resultatsReconnaissance;
    }

    public void setResultatsReconnaissance(String resultatsReconnaissance) {
        this.resultatsReconnaissance = resultatsReconnaissance;
    }

    /**
     * Full constructor with all fields except `errorMessage`.
     * This is useful for standard OCR processing results.
     *
     * @param id                     The unique identifier for the OCR result.
     * @param typeDocument           The type of document processed.
     * @param resultatsReconnaissance The OCR-recognized text or data.
     * @param fraud                  Flag indicating if fraud is suspected.
     * @param image                  Base64 encoded image data.
     * @param modelUsed              The model used for OCR, defaulted to "defaultModel" if null.
     * @param confidenceScore        The confidence score of the OCR process.
     */
    public OcrDTO(Long id, String numeroCompte, String typeDocument, String resultatsReconnaissance,
                  boolean fraud, String image, String modelUsed, String errorMessage, double confidenceScore) {
        this.id = id;
        this.typeDocument = typeDocument;
        this.resultatsReconnaissance = resultatsReconnaissance;
        this.fraud = fraud;
        this.image = image;
        this.modelUsed = modelUsed != null ? modelUsed : "defaultModel"; // Set default if null
        this.errorMessage = errorMessage;
        this.confidenceScore = confidenceScore;
    }


    // Getters and Setters...
}
