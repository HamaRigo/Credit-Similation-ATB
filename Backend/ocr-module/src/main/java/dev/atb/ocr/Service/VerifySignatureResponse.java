package dev.atb.ocr.Service;

public class VerifySignatureResponse {
    private float similarity;
    private String matchStatus;

    // Getters and setters
    public float getSimilarity() {
        return similarity;
    }

    public void setSimilarity(float similarity) {
        this.similarity = similarity;
    }

    public String getMatchStatus() {
        return matchStatus;
    }

    public void setMatchStatus(String matchStatus) {
        this.matchStatus = matchStatus;
    }
}
