package dev.atb.ocr.Service;

import dev.atb.dto.OcrDTO;
import dev.atb.ocr.config.OcrConfig; // Import the OcrConfig
import dev.atb.ocr.exceptions.OcrProcessingException;
import dev.atb.models.Ocr;
import dev.atb.repo.OcrRepository;
import dev.atb.repo.CompteRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OcrService {

    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);

    private final OcrRepository ocrRepository;
    private final CompteRepository compteRepository;
    private final OcrConfig ocrConfig; // Inject the OcrConfig

    @Autowired
    public OcrService(OcrRepository ocrRepository,
                      CompteRepository compteRepository,
                      OcrConfig ocrConfig) { // Remove unused dependencies
        this.ocrRepository = ocrRepository;
        this.compteRepository = compteRepository;
        this.ocrConfig = ocrConfig; // Initialize OcrConfig
    }

    private String generateUniqueFileName(String prefix, String extension) {
        return prefix + "_" + UUID.randomUUID() + extension;
    }

    public String performOcrWithTesseract(File file) {
        try {
            if (file.length() == 0) {
                logger.error("File is empty.");
                throw new IOException("File is empty.");
            }

            // Define the output file name without extension
            String outputFileName = file.getName().substring(0, file.getName().lastIndexOf('.'));
            File outputFile = new File(file.getParent(), outputFileName);

            // Command to execute Tesseract
            ProcessBuilder processBuilder = new ProcessBuilder(
                    "tesseract", file.getAbsolutePath(), outputFile.getAbsolutePath());

            Process process = processBuilder.start();

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new OcrProcessingException("Tesseract process failed with exit code: " + exitCode);
            }

            return new String(Files.readAllBytes(new File(outputFile.getAbsolutePath() + ".txt").toPath()));

        } catch (Exception e) {
            logger.error("Error during OCR processing for file: {}", file.getName(), e);
            throw new OcrProcessingException("Error occurred while processing OCR", e);
        }
    }

    /**
     * Analyzes and saves the image provided as a MultipartFile.
     *
     * @param imageFile     the image file to process
     * @param typeDocument  the type of document being processed (can be null)
     * @param numeroCompteId the account ID associated with the document (can be null)
     * @return an OcrDTO containing the results of the OCR processing
     * @throws OcrProcessingException if there is an error during processing
     */
    public OcrDTO analyzeAndSaveImage(MultipartFile imageFile, String typeDocument, String numeroCompteId) {
        File tempFile = null;
        File tempConvertedFile = null;
        try {
            String originalFileName = imageFile.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            tempFile = File.createTempFile("temp", "." + fileExtension);
            imageFile.transferTo(tempFile);

            // Convert the image
            tempConvertedFile = convertImage(tempFile, fileExtension);
            validateConvertedFile(tempConvertedFile);

            String ocrResult = performOcrWithTesseract(tempConvertedFile);
            Ocr ocr = new Ocr();
            ocr.setResultatsReconnaissance(ocrResult);
            ocr.setTypeDocument(typeDocument);
            if (numeroCompteId != null) {
                compteRepository.findById(numeroCompteId).ifPresent(ocr::setCompte);
            }

            ocrRepository.save(ocr);
            return convertToOcrDTO(ocr);
        } catch (IOException e) {
            logger.error("Error processing image file: {}", imageFile.getOriginalFilename(), e);
            throw new OcrProcessingException("Error occurred while processing image", e);
        } finally {
            cleanupTemporaryFiles(tempFile, tempConvertedFile);
        }
    }

    // Overloaded method to allow analyzing images without specifying typeDocument and numeroCompteId
    public OcrDTO analyzeAndSaveImage(MultipartFile imageFile) {
        return analyzeAndSaveImage(imageFile, "defaultType", null);
    }

    private File convertImage(File inputFile, String extension) throws IOException {
        File outputFile = File.createTempFile("converted", ".png");
        BufferedImage bufferedImage = ImageIO.read(inputFile);
        ImageIO.write(bufferedImage, "png", outputFile); // Convert to PNG format
        return outputFile;
    }

    private void validateConvertedFile(File file) throws IOException {
        if (!file.exists() || file.length() == 0) {
            throw new IOException("Converted file is invalid or empty: " + file.getAbsolutePath());
        }
    }

    private OcrDTO convertToOcrDTO(Ocr ocr) {
        OcrDTO ocrDTO = new OcrDTO();
        ocrDTO.setId(ocr.getId());
        ocrDTO.setResultatsReconnaissance(ocr.getResultatsReconnaissance());
        ocrDTO.setTypeDocument(ocr.getTypeDocument());
        // Set other fields as necessary
        return ocrDTO;
    }

    private void cleanupTemporaryFiles(File... files) {
        for (File file : files) {
            if (file != null && file.exists()) {
                boolean deleted = file.delete();
                if (!deleted) {
                    logger.warn("Failed to delete temporary file: {}", file.getAbsolutePath());
                }
            }
        }
    }


    public List<OcrDTO> getAllOcrEntities() {
        return ocrRepository.findAll().stream().map(this::convertToOcrDTO).collect(Collectors.toList());
    }

    public OcrDTO getOcrById(String id) {
        return ocrRepository.findById(id).map(this::convertToOcrDTO).orElse(null);
    }

    public boolean deleteOcr(String id) {
        if (ocrRepository.existsById(id)) {
            ocrRepository.deleteById(id);
            logger.info("Deleted OCR record with ID: {}", id);
            return true;
        } else {
            logger.warn("OCR record with ID {} not found.", id);
            return false;
        }
    }

    public OcrDTO updateOcr(String id, String newText, String documentType) {
        Optional<Ocr> optionalOcr = ocrRepository.findById(id);
        if (optionalOcr.isPresent()) {
            Ocr ocr = optionalOcr.get();
            ocr.setResultatsReconnaissance(newText);
            ocr.setTypeDocument(documentType);
            ocr = ocrRepository.save(ocr);
            return convertToOcrDTO(ocr);
        } else {
            logger.error("OCR record with ID {} not found.", id);
            throw new OcrProcessingException("OCR record not found");
        }
    }

    private String getFileExtension(String originalFileName) {
        int lastDotIndex = originalFileName.lastIndexOf('.');
        return (lastDotIndex > 0) ? originalFileName.substring(lastDotIndex) : ""; // return empty string if no extension
    }

    // Example method using ocrConfig properties
    public void printOcrConfig() {
        logger.info("Supported image types: {}", ocrConfig.getImageTypes());
        logger.info("Tesseract config path: {}", ocrConfig.getConfigPath());
        logger.info("Language: {}", ocrConfig.getLang());
    }
}
