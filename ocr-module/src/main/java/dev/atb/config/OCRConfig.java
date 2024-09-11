package dev.atb.config;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OCRConfig {

    @Value("${ocr.tesseract.lang}")
    private String tesseractLang;

    @Value("${ocr.config.path}")
    private String tesseractConfigPath;

    @Bean
    public ITesseract tesseract() {
        Tesseract tesseractInstance = new Tesseract();
        tesseractInstance.setLanguage(tesseractLang);

        // Debugging output
        System.out.println("Tesseract Language: " + tesseractLang);
        System.out.println("Tesseract Config Path: " + tesseractConfigPath);

        tesseractInstance.setDatapath(tesseractConfigPath);
        return tesseractInstance;
    }
}
