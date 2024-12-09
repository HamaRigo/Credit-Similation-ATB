package dev.atb.ocr.Service;

public class VerifySignatureRequest {
    private String accountId;
    private byte[] uploadedSignature;
    private byte[] storedSignature;

    // Constructor
    public VerifySignatureRequest(String accountId, byte[] uploadedSignature, byte[] storedSignature) {
        this.accountId = accountId;
        this.uploadedSignature = uploadedSignature;
        this.storedSignature = storedSignature;
    }

    // Getters and setters
    public String getAccountId() {
        return accountId;
    }

    public void setAccountId(String accountId) {
        this.accountId = accountId;
    }

    public byte[] getUploadedSignature() {
        return uploadedSignature;
    }

    public void setUploadedSignature(byte[] uploadedSignature) {
        this.uploadedSignature = uploadedSignature;
    }

    public byte[] getStoredSignature() {
        return storedSignature;
    }

    public void setStoredSignature(byte[] storedSignature) {
        this.storedSignature = storedSignature;
    }
}
