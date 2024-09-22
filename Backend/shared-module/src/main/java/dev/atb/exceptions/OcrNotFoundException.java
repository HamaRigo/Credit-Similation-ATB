package dev.atb.exceptions;

public class OcrNotFoundException extends RuntimeException {
    public OcrNotFoundException(String message) {
        super(message);
    }

    public OcrNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
