package dev.atb.ocr.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.atb.ocr.Service.OcrService;
import dev.atb.ocr.Service.SignatureService;
import dev.atb.ocr.config.OcrConfig;
import dev.atb.ocr.notification.LoggerService;
import dev.atb.ocr.notification.NotificationService;
import dev.atb.repo.CompteRepository;
import dev.atb.repo.OcrRepository;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.client.RestTemplate;

public class OcrServiceBuilder {

    private OcrRepository ocrRepository;
    private CompteRepository compteRepository;
    private OcrConfig ocrConfig;
    private SignatureService signatureService;
    private RestTemplate restTemplate;
    private KafkaTemplate<String, String> kafkaTemplate;
    private LoggerService loggerService;
    private NotificationService notificationService;
    private ObjectMapper objectMapper; // ✅ Added this

    // Setters for all dependencies
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

    public OcrServiceBuilder setSignatureService(SignatureService signatureService) {
        this.signatureService = signatureService;
        return this;
    }

    public OcrServiceBuilder setRestTemplate(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
        return this;
    }

    public OcrServiceBuilder setKafkaTemplate(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
        return this;
    }

    public OcrServiceBuilder setLoggerService(LoggerService loggerService) {
        this.loggerService = loggerService;
        return this;
    }

    public OcrServiceBuilder setNotificationService(NotificationService notificationService) {
        this.notificationService = notificationService;
        return this;
    }

    public OcrServiceBuilder setObjectMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
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
        if (kafkaTemplate == null) {
            throw new IllegalStateException("KafkaTemplate must be set");
        }
        if (loggerService == null) { // Validate LoggerService
            throw new IllegalStateException("LoggerService must be set");
        }
        if (notificationService == null) {
            throw new IllegalStateException("NotificationService must be set");
        }
        if (objectMapper == null) throw new IllegalStateException("ObjectMapper must be set"); // ✅ Added validation

        // Pass only the necessary arguments to match the OcrService constructor
        return new OcrService(ocrRepository, compteRepository, restTemplate, kafkaTemplate, loggerService, notificationService, objectMapper, signatureService);
    }
}