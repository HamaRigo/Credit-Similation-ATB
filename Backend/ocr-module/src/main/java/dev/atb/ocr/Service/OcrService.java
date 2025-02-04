package dev.atb.ocr.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.atb.dto.OcrDTO;
import dev.atb.dto.ToDtoConverter;
import dev.atb.models.Client;
import dev.atb.models.Compte;
import dev.atb.ocr.Service.support.OcrRequest;
import dev.atb.ocr.Service.support.OcrResponse;
import dev.atb.ocr.config.OcrConfig;
import dev.atb.ocr.exceptions.OcrProcessingException;
import dev.atb.models.Ocr;
import dev.atb.repo.OcrRepository;
import dev.atb.repo.CompteRepository;
import org.apache.kafka.common.errors.SerializationException;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class OcrService {
    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);
    private final OcrRepository ocrRepository;
    private final CompteRepository compteRepository;
    private final OcrConfig ocrConfig;
    private final SignatureService signatureService;
    private final RestTemplate restTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private static final String SIGNATURE_API_URL = "http://127.0.0.1:5005";
    private static final String TESSERACT_API_URL = "http://127.0.0.1:5006";

    @Autowired
    public OcrService(OcrRepository ocrRepository, CompteRepository compteRepository, OcrConfig ocrConfig,
                      SignatureService signatureService, RestTemplate restTemplate,
                      KafkaTemplate<String, String> kafkaTemplate) {
        this.ocrRepository = ocrRepository;
        this.compteRepository = compteRepository;
        this.ocrConfig = ocrConfig;
        this.signatureService = signatureService;
        this.restTemplate = restTemplate;
        this.kafkaTemplate = kafkaTemplate;
    }

    public List<OcrDTO> findAll() {
        List<Ocr> ocrs = ocrRepository.findAll();
        return ocrs.stream().map(ToDtoConverter::ocrToDto).collect(Collectors.toList());
    }

    public OcrDTO findById(final Long id) {
        Ocr ocr = ocrRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocr not found"));
        return ToDtoConverter.ocrToDto(ocr);
    }

    public void deleteById(final Long id) {
        Ocr ocr = ocrRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocr not found"));
        ocrRepository.delete(ocr);
    }

    public OcrDTO uploadAndAnalyzeImage(MultipartFile imageFile, String typeDocument, Long id, String signatureBase64) {
        File tempFile = null;
        try {
            // Save the image to a temporary file
            String fileExtension = getFileExtension(imageFile.getOriginalFilename());
            tempFile = saveToTemporaryFile(imageFile, fileExtension);

            // Convert PDF to TIFF if necessary
            if ("pdf".equalsIgnoreCase(fileExtension)) {
                tempFile = convertPdfToTiff(tempFile);
            }

            // Perform OCR
            String ocrResult = performOcrWithTesseract(tempFile);

            // Convert image to Base64
            String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());

            OcrDTO ocrDTO = new OcrDTO();
            ocrDTO.setResultatsReconnaissance(ocrResult);
            ocrDTO.setImage(base64Image);
            ocrDTO.setTypeDocument(typeDocument);

            // Retrieve associated account and perform fraud check
            Optional<Compte> compteOpt = compteRepository.findById(id);
            if (compteOpt.isPresent()) {
                Compte compte = compteOpt.get();
                Client client = compte.getClient();

                if (client != null && client.getSignature() != null) {
                    boolean isFraud = !compareSignatureWithPython(tempFile);
                    ocrDTO.setFraud(isFraud);

                    saveOcrResult(ocrDTO, compte, isFraud);
                }
            }

            // Send result to Kafka
            sendOcrResultToKafka("ocr_results", new ObjectMapper().writeValueAsString(ocrDTO));
            return ocrDTO;
        } catch (Exception e) {
            logger.error("Error processing image file", e);
            throw new OcrProcessingException("Failed to analyze the image", e);
        } finally {
            cleanupTemporaryFiles(tempFile);
        }
    }

    /**
     * New method to upload an image, perform OCR, and display a preview.
     */
    public OcrDTO uploadImageAndPreview(MultipartFile imageFile, String typeDocument) {
        File tempFile = null;
        try {
            // Save the image to a temporary file
            String fileExtension = getFileExtension(imageFile.getOriginalFilename());
            tempFile = saveToTemporaryFile(imageFile, fileExtension);

            // Perform OCR
            String ocrResult = performOcrWithTesseract(tempFile);

            // Convert the uploaded image to Base64 for preview display
            String base64Image = Base64.getEncoder().encodeToString(imageFile.getBytes());

            // Create the OcrDTO object with OCR results and base64 image for preview
            OcrDTO ocrDTO = new OcrDTO();
            ocrDTO.setResultatsReconnaissance(ocrResult);
            ocrDTO.setImage(base64Image);  // This is the preview image in Base64 format
            ocrDTO.setTypeDocument(typeDocument);

            // Return the OCR results and image preview in the DTO
            return ocrDTO;

        } catch (Exception e) {
            logger.error("Error processing image file", e);
            throw new OcrProcessingException("Failed to analyze the image", e);
        } finally {
            cleanupTemporaryFiles(tempFile);
        }
    }
    private File saveToTemporaryFile(MultipartFile file, String extension) throws IOException {
        File tempFile = File.createTempFile("temp", "." + extension);
        file.transferTo(tempFile);
        return tempFile;
    }

    private void saveOcrResult(OcrDTO ocrDTO, Compte compte, boolean isFraud) {
        try {
            Ocr ocr = new Ocr();
            ocr.setTypeDocument(ocrDTO.getTypeDocument());
            ocr.setResultatsReconnaissance(ocrDTO.getResultatsReconnaissance());
            ocr.setFraud(isFraud);
            ocr.setCompte(compte);
            ocrRepository.save(ocr);
            logger.info("OCR result saved to database with fraud status: {}", isFraud);
        } catch (Exception e) {
            logger.error("Failed to save OCR result", e);
        }
    }

    private void sendOcrResultToKafka(String topic, String message) {
        try {
            kafkaTemplate.send(topic, message);
            logger.info("Sent message to Kafka topic {}: {}", topic, message);
        } catch (SerializationException e) {
            logger.error("Failed to send Kafka message", e);
        }
    }

    private boolean compareSignatureWithPython(File imageFile) {
        try {
            byte[] imageBytes = Files.readAllBytes(imageFile.toPath());
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);

            OcrRequest request = new OcrRequest();
            request.setImage(base64Image);

            ResponseEntity<OcrResponse> response = restTemplate.postForEntity(
                    SIGNATURE_API_URL + "/compare_signature", request, OcrResponse.class);

            return response.getStatusCode() == HttpStatus.OK && response.getBody() != null && response.getBody().isFraud();
        } catch (Exception e) {
            logger.error("Error during signature comparison", e);
            return false; // Default to non-fraud on error
    }

    }

    private String performOcrWithTesseract(File imageFile) throws IOException, InterruptedException {
            String command = String.format("curl -X POST --data-binary @%s %s/ocr", imageFile.getAbsolutePath(), TESSERACT_API_URL);
            Process process = Runtime.getRuntime().exec(command);

        if (!process.waitFor(30, TimeUnit.SECONDS)) {
            throw new InterruptedException("OCR process timed out");
        }
            return new String(process.getInputStream().readAllBytes());
    }

    private void cleanupTemporaryFiles(File tempFile) {
        if (tempFile != null && tempFile.exists()) {
            boolean deleted = tempFile.delete();
            if (!deleted) {
                logger.warn("Failed to delete temporary file: {}", tempFile.getAbsolutePath());
    }
        }
    }
    // PDF-to-TIFF conversion using Apache PDFBox
    private File convertPdfToTiff(File pdfFile) throws IOException {
        PDDocument document = PDDocument.load(pdfFile);
        PDFRenderer renderer = new PDFRenderer(document);

        // Render the first page as an image (could be modified to render all pages)
        BufferedImage image = renderer.renderImage(0);
        File tiffFile = new File(pdfFile.getAbsolutePath().replace(".pdf", ".tiff"));
        ImageIO.write(image, "TIFF", tiffFile);

        document.close();
        logger.info("Converted PDF to TIFF: {}", tiffFile.getAbsolutePath());
        return tiffFile;
    }
    // Update an existing OCR record
    public OcrDTO updateOcr(Long id, String newText, String documentType) {
        Optional<Ocr> optionalOcr = ocrRepository.findById(id);
        if (optionalOcr.isPresent()) {
            Ocr ocr = optionalOcr.get();
            ocr.setResultatsReconnaissance(newText);
            ocr.setTypeDocument(documentType);
            return convertToOcrDTO(ocrRepository.save(ocr));
        }
        return null;  // Return null if the OCR with the given ID doesn't exist
    }
    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf('.') + 1);
    }
    public String generateSignatureBase64(byte[] signatureBytes) {
        return Base64.getEncoder().encodeToString(signatureBytes);
    }
    private OcrDTO convertToOcrDTO(Ocr ocr) {
        OcrDTO dto = new OcrDTO();
        dto.setTypeDocument(ocr.getTypeDocument());
        dto.setResultatsReconnaissance(ocr.getResultatsReconnaissance());
        dto.setImage(ocr.getImage());
        dto.setFraud(ocr.getFraud());
        return dto;
    }

}

