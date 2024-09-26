package dev.atb.ocr.config;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

    public class FileUtils {

        public static File createUniqueFile(String originalFileName) throws IOException {
            // Generate a unique ID for the file
            String uniqueId = UUID.randomUUID().toString();

            // Extract file extension
            String extension = originalFileName.substring(originalFileName.lastIndexOf("."));

            // Create a unique file name
            String uniqueFileName = uniqueId + extension;

            // Create the file (assuming a specific directory, adjust as needed)
            File file = new File("/path/to/directory/" + uniqueFileName);

            // Create the file if it does not exist
            if (!file.exists()) {
                file.createNewFile();
            }

            return file;
        }
    }

