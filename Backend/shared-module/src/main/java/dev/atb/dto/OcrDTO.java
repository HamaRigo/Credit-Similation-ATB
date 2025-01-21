package dev.atb.dto;

import lombok.*;

/**
 * Data Transfer Object for OCR processing results.
 * Contains details about the OCR results, the document type, fraud status,
 * image data in Base64 encoding, and other optional fields for specific use cases.
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "image") // Avoid printing sensitive image data in logs
public class OcrDTO {
    private String NumeroCompte;
    private String typeDocument;
    private String resultatsReconnaissance;
    private boolean fraud;
    private String image; // Base64 encoded string
    private String modelUsed = "defaultModel"; // Default model name if not provided
    private String errorMessage; // For error messages
    private double confidenceScore = 0.0; // Default confidence score



    /**
     * Full constructor with all fields except `errorMessage`.
     * This is useful for standard OCR processing results.
     *
     * @param NumeroCompte                     The unique identifier for the OCR result.
     * @param typeDocument           The type of document processed.
     * @param resultatsReconnaissance The OCR-recognized text or data.
     * @param fraud                  Flag indicating if fraud is suspected.
     * @param image                  Base64 encoded image data.
     * @param modelUsed              The model used for OCR, defaulted to "defaultModel" if null.
     * @param confidenceScore        The confidence score of the OCR process.
     */
    public OcrDTO(String NumeroCompte, String typeDocument, String resultatsReconnaissance, boolean fraud, String image, String modelUsed, double confidenceScore) {
        this.NumeroCompte = NumeroCompte;
        this.typeDocument = typeDocument;
        this.resultatsReconnaissance = resultatsReconnaissance;
        this.fraud = fraud;
        this.image = image;
        this.modelUsed = (modelUsed != null) ? modelUsed : "defaultModel";
        this.confidenceScore = confidenceScore;
    }

    /**
     * Constructor for cases where confidenceScore is not required.
     *
     * @param NumeroCompte                     The unique identifier for the OCR result.
     * @param typeDocument           The type of document processed.
     * @param resultatsReconnaissance The OCR-recognized text or data.
     * @param fraud                  Flag indicating if fraud is suspected.
     * @param image                  Base64 encoded image data.
     * @param modelUsed              The model used for OCR, defaulted to "defaultModel" if null.
     */
    public OcrDTO(String NumeroCompte, String typeDocument, String resultatsReconnaissance, Boolean fraud, String image, String modelUsed) {
        this(NumeroCompte, typeDocument, resultatsReconnaissance, fraud, image, modelUsed, 0.0); // Default confidence score
    }
    /**
     * Constructor with `errorMessage` only.
     * Useful for error handling in OCR processing.
     *
     * @param errorMessage The error message describing the OCR failure.
     */
    public OcrDTO(String errorMessage) {
        this.errorMessage = errorMessage;
    }




    public String getError() {
        return errorMessage;
    }

    public void setError(String errorMessage) {
        this.errorMessage = errorMessage;
    }


}
