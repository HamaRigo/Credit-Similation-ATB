package dev.atb.config;

import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class MultipartFileUtil {

    public static MultipartFile fileToMultipartFile(File file) throws IOException {
        // Use try-with-resources to automatically close the FileInputStream
        try (FileInputStream input = new FileInputStream(file)) {
            // Create a MockMultipartFile from the FileInputStream
            return new MockMultipartFile(
                    "file",                      // Name of the parameter
                    file.getName(),               // Original filename
                    "image/png",                  // MIME type, change if needed
                    input                         // InputStream
            );
        }
    }
}
