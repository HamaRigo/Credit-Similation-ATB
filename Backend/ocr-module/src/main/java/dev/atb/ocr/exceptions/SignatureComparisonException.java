package dev.atb.ocr.exceptions;


public class SignatureComparisonException extends RuntimeException {
    public SignatureComparisonException(String message) {
        super(message);
    }

    public SignatureComparisonException(String message, Throwable cause) {
        super(message, cause);
    }
}
