package dev.atb.ocr.Service;

import dev.atb.repo.OcrRepository;
import dev.atb.repo.CompteRepository;
import dev.atb.ocr.config.OcrConfig; // Import OcrConfig
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.client.RestTemplate; // Import RestTemplate;

public class OcrServiceBuilder {
    private OcrRepository ocrRepository;
    private CompteRepository compteRepository;
    private OcrConfig ocrConfig;
    private RestTemplate restTemplate; // Add RestTemplate field
    private SignatureService signatureService; // Add SignatureService field
    private RestTemplate RestTemplate; // Add RestTemplate field
    private KafkaTemplate kafkaTemplate; // Add RestTemplate field

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

    public OcrServiceBuilder setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        return this;
    }
    public OcrServiceBuilder setSignatureService(SignatureService signatureService) {
        this.signatureService = signatureService;
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
        if (restTemplate == null) { // Validation for RestTemplate
            throw new IllegalStateException("RestTemplate must be set");
        }
        if (signatureService == null) { // Validation for SignatureService
            throw new IllegalStateException("SignatureService must be set");
        }

        // Create and return the OcrService instance with the correct constructor
        return new OcrService(ocrRepository, compteRepository, ocrConfig, signatureService,restTemplate,kafkaTemplate);
    }
}
