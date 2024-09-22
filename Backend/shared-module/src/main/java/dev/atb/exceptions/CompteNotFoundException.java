package dev.atb.exceptions;

public class CompteNotFoundException extends RuntimeException {
    public CompteNotFoundException(String message) {
        super(message);
    }

    public CompteNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
