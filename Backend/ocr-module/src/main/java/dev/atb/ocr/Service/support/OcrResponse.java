package dev.atb.ocr.Service.support;

public class OcrResponse {
    private String numeroCompte;           // Account number associated with the OCR result
    private String typeDocument;           // Type of document processed (e.g., "invoice", "passport")
    private String resultatsReconnaissance; // OCR recognition result (text extracted from the image)
    private String image;                  // Base64 encoded image (the original image or processed result)
    private boolean fraud;                 // Fraud status (true if fraud detected, false otherwise)

    // Constructors
    public OcrResponse() {}

    public OcrResponse(String numeroCompte, String typeDocument, String resultatsReconnaissance, String image, boolean fraud) {
        this.numeroCompte = numeroCompte;
        this.typeDocument = typeDocument;
        this.resultatsReconnaissance = resultatsReconnaissance;
        this.image = image;
        this.fraud = fraud;
    }

    // Getters and Setters
    public String getNumeroCompte() {
        return numeroCompte;
    }

    public void setNumeroCompte(String numeroCompte) {
        this.numeroCompte = numeroCompte;
    }

    public String getTypeDocument() {
        return typeDocument;
    }

    public void setTypeDocument(String typeDocument) {
        this.typeDocument = typeDocument;
    }

    public String getResultatsReconnaissance() {
        return resultatsReconnaissance;
    }

    public void setResultatsReconnaissance(String resultatsReconnaissance) {
        this.resultatsReconnaissance = resultatsReconnaissance;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
    public boolean isFraud() {
        return fraud;
    }

    public void setFraud(boolean fraud) {
        this.fraud = fraud;
    }
}

