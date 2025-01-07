package dev.atb.ocr.config;

/**
 * Generic wrapper for API responses.
 * @param <T> Type of the response data.
 */
public class ApiResponse<T> {
    private String message;
    private T data;

    // Default constructor
    public ApiResponse() {}

    // Constructor with fields
    public ApiResponse(String message, T data) {
        this.message = message;
        this.data = data;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "ApiResponse{" +
                "message='" + message + '\'' +
                ", data=" + data +
                '}';
    }
}