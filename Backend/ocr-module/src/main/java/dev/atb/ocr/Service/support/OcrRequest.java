package dev.atb.ocr.Service.support;

public class OcrRequest {
    private String filePath;        // Path to the image or document file
    private String typeDocument;    // Type of the document (e.g., "invoice", "passport", etc.)
    private String numeroCompteId;  // Account number ID
    private String signatureBase64; // Base64 encoded signature (if applicable)
    private String image;           // The image in base64 (if required)

    // Constructors
    public OcrRequest() {}

    public OcrRequest(String filePath, String typeDocument, String numeroCompteId, String signatureBase64, String image) {
        this.filePath = filePath;
        this.typeDocument = typeDocument;
        this.numeroCompteId = numeroCompteId;
        this.signatureBase64 = signatureBase64;
        this.image = image;
    }

    // Getters and Setters
    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getTypeDocument() {
        return typeDocument;
    }
    public void setTypeDocument(String typeDocument) {
        this.typeDocument = typeDocument;
}

    public String getNumeroCompteId() {
        return numeroCompteId;
    }

    public void setNumeroCompteId(String numeroCompteId) {
        this.numeroCompteId = numeroCompteId;
    }

    public String getSignatureBase64() {
        return signatureBase64;
    }

    public void setSignatureBase64(String signatureBase64) {
        this.signatureBase64 = signatureBase64;
    }
    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
