package dev.atb.ocr.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Service
public class FileValidationService {

    // Define allowed file types and maximum file size (in bytes)
    private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList("image/jpeg", "image/png", "image/gif");
    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    /**
     * Validates the file type and size.
     *
     * @param file The file to validate.
     * @return True if the file is valid, otherwise false.
     */
    public boolean validateFile(MultipartFile file) {
        return isFileTypeValid(file) && isFileSizeValid(file);
    }

    /**
     * Checks if the file type is valid.
     *
     * @param file The file to check.
     * @return True if the file type is allowed, otherwise false.
     */
    private boolean isFileTypeValid(MultipartFile file) {
        String contentType = file.getContentType();
        if (contentType == null) {
            return false;
        }
        return ALLOWED_FILE_TYPES.contains(contentType);
    }

    /**
     * Checks if the file size is within the allowed limit.
     *
     * @param file The file to check.
     * @return True if the file size is within the limit, otherwise false.
     */
    private boolean isFileSizeValid(MultipartFile file) {
        return file.getSize() <= MAX_FILE_SIZE;
    }

    /**
     * Validates the file extension.
     *
     * @param file The file to check.
     * @return True if the file extension is allowed, otherwise false.
     */
    public boolean validateFileExtension(MultipartFile file) {
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            return false;
        }
        String extension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        // Define allowed extensions
        List<String> allowedExtensions = Arrays.asList("jpg", "jpeg", "png", "gif");
        return allowedExtensions.contains(extension);
    }
}
