package dev.atb.ocr.Service;

import dev.atb.repo.OcrRepository;
import dev.atb.repo.CompteRepository;
import dev.atb.ocr.config.OcrConfig; // Import OcrConfig

public class OcrServiceBuilder {
    private OcrRepository ocrRepository;
    private CompteRepository compteRepository;
    private OcrConfig ocrConfig; // Remove WebClient.Builder and ImageConverter

    public OcrServiceBuilder setOcrRepository(OcrRepository ocrRepository) {
        this.ocrRepository = ocrRepository;
        return this;
    }

    public OcrServiceBuilder setCompteRepository(CompteRepository compteRepository) {
        this.compteRepository = compteRepository;
        return this;
    }

    public OcrServiceBuilder setOcrConfig(OcrConfig ocrConfig) {
        this.ocrConfig = ocrConfig;
        return this;
    }

    public OcrService build() {
        // Validation to ensure all required fields are set
        if (ocrRepository == null) {
            throw new IllegalStateException("OcrRepository must be set");
        }
        if (compteRepository == null) {
            throw new IllegalStateException("CompteRepository must be set");
        }
        if (ocrConfig == null) {
            throw new IllegalStateException("OcrConfig must be set");
        }

        // Create and return the OcrService instance
        return new OcrService(ocrRepository, compteRepository, ocrConfig); // Adjust the constructor call
    }
}
