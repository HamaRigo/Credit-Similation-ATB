package dev.atb.config;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OCRConfig {

    private static final Logger logger = LoggerFactory.getLogger(OCRConfig.class);

    @Value("${ocr.tesseract.lang}")
    private String tesseractLang;

    @Value("${ocr.config.path}")
    private String tesseractConfigPath;

    @Value("${ocr.tesseract.image.types}")
    private List<String> supportedImageTypes;

    @Bean
    public ITesseract tesseract() {
        Tesseract tesseractInstance = new Tesseract();
        tesseractInstance.setLanguage(tesseractLang);
        tesseractInstance.setDatapath(tesseractConfigPath);

        // Log configuration details
        logger.info("Initializing Tesseract with language: {}", tesseractLang);
        logger.info("Tesseract data path set to: {}", tesseractConfigPath);
        logger.info("Supported image types: {}", supportedImageTypes);

        return tesseractInstance;
    }

    // Getters for other components that may need configuration
    public List<String> getSupportedImageTypes() {
        return supportedImageTypes;
    }

    public String getTesseractLang() {
        return tesseractLang;
    }

    public String getTesseractConfigPath() {
        return tesseractConfigPath;
    }
}