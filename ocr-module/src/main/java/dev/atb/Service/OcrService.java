package dev.atb.Service;

import dev.atb.dto.OcrDTO;
import dev.atb.exceptions.OcrProcessingException;
import dev.atb.models.Ocrs;
import dev.atb.repo.OcrRepository;
import dev.atb.repo.CompteRepository;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.TesseractException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OcrService {

    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);

    private final ITesseract tesseract;
    private final OcrRepository ocrRepository;
    private final CompteRepository compteRepository;
    private final ImageConverter imageConverter;

    @Autowired
    public OcrService(ITesseract tesseract, OcrRepository ocrRepository, CompteRepository compteRepository, ImageConverter imageConverter) {
        this.tesseract = tesseract;
        this.ocrRepository = ocrRepository;
        this.compteRepository = compteRepository;
        this.imageConverter = imageConverter;
    }

    private String generateUniqueFileName(String prefix, String extension) {
        return prefix + "_" + UUID.randomUUID() + extension;
    }

    public OcrDTO performOcr(File file) {
        try {
            if (file.length() == 0) {
                logger.error("File is empty.");
                throw new IOException("File is empty.");
            }

            String ocrResult = tesseract.doOCR(file);
            boolean isFraud = determineFraud(ocrResult);

            OcrDTO ocrDTO = new OcrDTO();
            ocrDTO.setResultatsReconnaissance(ocrResult);
            ocrDTO.setFraude(isFraud);
            ocrDTO.setImage(encodeImageToBase64(file)); // Encode the image to Base64

            return ocrDTO;

        } catch (TesseractException e) {
            logger.error("Error occurred during OCR processing for file: {}", file.getName(), e);
            throw new OcrProcessingException("Error occurred during OCR processing", e);
        } catch (IOException e) {
            logger.error("I/O error occurred during OCR processing for file: {}", file.getName(), e);
            throw new OcrProcessingException("Error occurred while processing OCR", e);
        }
    }

    public OcrDTO analyzeAndSaveImage(MultipartFile imageFile, String typeDocument, String numeroCompteId) {
        File tempFile = null;
        File tempConvertedFile = null;
        try {
            String originalFileName = imageFile.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);

            // Create a temporary file for the image and handle conversions
            if (fileExtension.equalsIgnoreCase("heic")) {
                tempFile = File.createTempFile("temp", ".heic");
                imageFile.transferTo(tempFile);
                tempConvertedFile = imageConverter.convertHeicToPng(tempFile);
            } else if (fileExtension.equalsIgnoreCase("jpg")) {
                tempFile = File.createTempFile("temp", ".jpg");
                imageFile.transferTo(tempFile);
                tempConvertedFile = imageConverter.convertJpgToPng(tempFile);
            } else if (fileExtension.equalsIgnoreCase("pdf")) {
                tempFile = File.createTempFile("temp", ".pdf");
                imageFile.transferTo(tempFile);
                tempConvertedFile = imageConverter.convertPdfToPng(tempFile);
            } else {
                logger.error("Unsupported file format: {}", fileExtension);
                throw new IOException("Unsupported file format.");
            }

            // Ensure the converted file is valid
            if (tempConvertedFile == null || !tempConvertedFile.exists() || tempConvertedFile.length() == 0) {
                logger.error("Converted file creation failed or file is empty.");
                throw new IOException("Converted file creation failed or file is empty.");
            }

            // Perform OCR directly on the converted file
            OcrDTO ocrDTO = performOcr(tempConvertedFile);
            ocrDTO.setTypeDocument(typeDocument);
            ocrDTO.setNumeroCompteId(numeroCompteId);

            return ocrDTO;
        } catch (IOException e) {
            logger.error("I/O error processing image file: {}", imageFile.getOriginalFilename(), e);
            throw new OcrProcessingException("Error occurred while processing image", e);
        } catch (OcrProcessingException e) {
            logger.error("OCR processing error: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error: {}", e.getMessage(), e);
            throw new OcrProcessingException("Unexpected error occurred", e);
        } finally {
            // Clean up temporary files
            if (tempFile != null && tempFile.exists() && !tempFile.delete()) {
                logger.warn("Failed to delete temporary file: {}", tempFile.getAbsolutePath());
            }
            if (tempConvertedFile != null && tempConvertedFile.exists() && !tempConvertedFile.delete()) {
                logger.warn("Failed to delete temporary converted file: {}", tempConvertedFile.getAbsolutePath());
            }
        }
    }

    private String getFileExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return fileName.substring(lastDotIndex + 1);
    }

    public List<OcrDTO> getAllOcrEntities() {
        List<Ocrs> ocrsList = ocrRepository.findAll();
        return ocrsList.stream().map(this::convertToOcrDTO).collect(Collectors.toList());
    }

    public OcrDTO getOcrById(String id) {
        Optional<Ocrs> optionalOcr = ocrRepository.findById(id);
        return optionalOcr.map(this::convertToOcrDTO).orElse(null);
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

    public Ocrs updateOcr(String id, String newText, String documentType) {
        Optional<Ocrs> optionalOcr = ocrRepository.findById(id);
        if (optionalOcr.isPresent()) {
            Ocrs ocr = optionalOcr.get();
            ocr.setResultatsReconnaissance(newText);
            ocr.setTypeDocument(documentType);
            return ocrRepository.save(ocr);
        } else {
            logger.error("OCR record with ID {} not found.", id);
            throw new OcrProcessingException("OCR record not found");
        }
    }

    public OcrDTO convertToOcrDTO(Ocrs ocrs) {
        OcrDTO ocrDTO = new OcrDTO();
        ocrDTO.setId(ocrs.getId());
        ocrDTO.setTypeDocument(ocrs.getTypeDocument());
        ocrDTO.setResultatsReconnaissance(ocrs.getResultatsReconnaissance());
        ocrDTO.setFraude(ocrs.isFraude());
        ocrDTO.setImage(ocrs.getImage());
        String numeroCompteId = ocrs.getNumeroCompte() != null ? ocrs.getNumeroCompte().getId() : null;
        ocrDTO.setNumeroCompteId(numeroCompteId);
        return ocrDTO;
    }

    private boolean determineFraud(String text) {
        // Placeholder for fraud detection logic
        return false; // Implement actual fraud detection logic
    }

    private String encodeImageToBase64(File imageFile) throws IOException {
        try (InputStream inputStream = new FileInputStream(imageFile)) {
            byte[] fileContent = inputStream.readAllBytes();
            return java.util.Base64.getEncoder().encodeToString(fileContent);
        }
    }
}
