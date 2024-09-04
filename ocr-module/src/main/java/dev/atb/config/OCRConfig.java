package dev.atb.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
@Component

public class OCRConfig {

    @Value("${ocr.tesseract.data.path}")
    private String tesseractDataPath;

    public String getTesseractDataPath() {
        return tesseractDataPath;
    }

    // Other configuration-related methods
}
