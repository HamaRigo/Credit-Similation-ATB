package dev.atb.Service;

import dev.atb.config.OCRConfig;
import dev.atb.dto.OcrDTO;
import dev.atb.exceptions.CompteNotFoundException;
import dev.atb.exceptions.OcrNotFoundException;
import dev.atb.models.Compte;
import dev.atb.models.Ocr;
import dev.atb.repo.CompteRepository;
import dev.atb.repo.OcrRepository;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

import java.util.Base64;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.nio.file.StandardCopyOption;

@Service
public class OcrService {

    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);

    private final OcrRepository ocrRepository;

    private final CompteRepository compteRepository;

    private final OCRConfig ocrConfig; // Inject the OCRConfig for Tesseract data path

    public OcrService(OcrRepository ocrRepository, CompteRepository compteRepository, OCRConfig ocrConfig) {
        this.ocrRepository = ocrRepository;
        this.compteRepository = compteRepository;
        this.ocrConfig = ocrConfig;
    }

    /**
     * Fetches an OCR entity by its ID.
     *
     * @param id the ID of the OCR entity
     * @return the OCR DTO
     */
    public OcrDTO getOcrById(String id) {
        logger.debug("Fetching OCR entity with ID: {}", id);
        Ocr ocr = ocrRepository.findById(id)
                .orElseThrow(() -> new OcrNotFoundException("OCR entity with ID " + id + " not found"));
        return convertToDTO(ocr);
    }

    /**
     * Fetches all OCR entities.
     *
     * @return a list of OCR DTOs
     */
    public List<OcrDTO> getAllOcrEntities() {
        logger.debug("Fetching all OCR entities");
        return ocrRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Performs OCR on the provided image file.
     *
     * @param imageFile the image file to process
     * @return the OCR DTO with results and encoded image
     */
    public OcrDTO performOcr(MultipartFile imageFile) {
        validateImageFile(imageFile);

        try {
            BufferedImage bufferedImage = convertImageFile(imageFile);
            String ocrResult = performOcrOnImage(bufferedImage);

            OcrDTO ocrDTO = new OcrDTO();
            ocrDTO.setResultatsReconnaissance(ocrResult);

            String base64Image = encodeImageToBase64(imageFile);
            ocrDTO.setImage(base64Image);

            Ocr ocrEntity = convertToEntity(ocrDTO);
            ocrEntity = ocrRepository.save(ocrEntity);

            return convertToDTO(ocrEntity);
        } catch (IOException | TesseractException e) {
            logger.error("Error performing OCR: ", e);
            throw new RuntimeException("Error performing OCR: " + e.getMessage(), e);
        }
    }

    /**
     * Analyzes and saves the provided image, setting fraud status based on OCR results.
     *
     * @param file the image file to process
     * @param typeDocument the type of document (e.g., "effet" or "cheque")
     * @param numeroCompteId the ID of the associated Compte
     * @return the OCR DTO with results and fraud status
     */
    public OcrDTO analyzeAndSaveImage(MultipartFile file, String typeDocument, String numeroCompteId) {
        validateImageFile(file);

        try {
            BufferedImage bufferedImage = convertImageFile(file);
            String resultatsReconnaissance = performOcrOnImage(bufferedImage);

            // Determine if the document is fraudulent
            boolean isFraud = !resultatsReconnaissance.equals("expectedResult"); // Replace with your fraud detection logic

            Ocr ocrEntity = new Ocr();
            ocrEntity.setTypeDocument(typeDocument);
            ocrEntity.setResultatsReconnaissance(resultatsReconnaissance);
            ocrEntity.setFraude(isFraud);

            if (numeroCompteId != null) {
                Compte compte = compteRepository.findById(numeroCompteId)
                        .orElseThrow(() -> new CompteNotFoundException("Compte with ID " + numeroCompteId + " not found"));
                ocrEntity.setNumeroCompte(compte);
            }

            ocrEntity = ocrRepository.save(ocrEntity);

            return convertToDTO(ocrEntity);
        } catch (IOException | TesseractException e) {
            logger.error("Error analyzing and saving image: ", e);
            throw new RuntimeException("Error analyzing and saving image: " + e.getMessage(), e);
        }
    }

    /**
     * Deletes an OCR entity by its ID.
     *
     * @param id the ID of the OCR entity
     * @return true if the entity was deleted, false otherwise
     */
    public boolean deleteOcrById(String id) {
        if (ocrRepository.existsById(id)) {
            ocrRepository.deleteById(id);
            logger.debug("Deleted OCR entity with ID: {}", id);
            return true;
        } else {
            throw new OcrNotFoundException("OCR entity with ID " + id + " not found");
        }
    }

    /**
     * Converts an Ocr entity to an OcrDTO.
     *
     * @param ocr the Ocr entity
     * @return the OcrDTO
     */
    private OcrDTO convertToDTO(Ocr ocr) {
        OcrDTO dto = new OcrDTO();
        BeanUtils.copyProperties(ocr, dto);
        if (ocr.getNumeroCompte() != null) {
            dto.setNumeroCompteId(ocr.getNumeroCompte().getId());
        }
        return dto;
    }

    /**
     * Converts an OcrDTO to an Ocr entity.
     *
     * @param dto the OcrDTO
     * @return the Ocr entity
     */
    private Ocr convertToEntity(OcrDTO dto) {
        Ocr ocr = new Ocr();
        BeanUtils.copyProperties(dto, ocr);
        return ocr;
    }

    /**
     * Validates the provided image file.
     *
     * @param file the image file to validate
     */
    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("The file is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("The file is not a valid image");
        }

        if (file.getSize() > 10 * 1024 * 1024) { // Limit size to 10 MB
            throw new IllegalArgumentException("The file size exceeds the maximum allowed size of 10 MB");
        }
    }


    /**
     * Converts a MultipartFile to a BufferedImage.
     *
     * @param file the image file
     * @return the BufferedImage
     * @throws IOException if an I/O error occurs
     */
    private BufferedImage convertImageFile(MultipartFile file) throws IOException {
        String fileExtension = getFileExtension(file.getOriginalFilename());

        if ("heic".equalsIgnoreCase(fileExtension)) {
            return convertHeicToJpg(file.getInputStream());
        } else {
            return ImageIO.read(file.getInputStream());
        }
    }

    /**
     * Performs OCR on the provided BufferedImage.
     *
     * @param image the BufferedImage
     * @return the OCR result
     * @throws TesseractException if an OCR error occurs
     */
    private String performOcrOnImage(BufferedImage image) throws TesseractException {
        ITesseract tesseract = new net.sourceforge.tess4j.Tesseract();
        tesseract.setDatapath(ocrConfig.getTesseractDataPath()); // Use the path from OCRConfig
        return tesseract.doOCR(image);
    }

    /**
     * Encodes an image file to a Base64 string.
     *
     * @param imageFile the image file
     * @return the Base64 encoded string
     * @throws IOException if an I/O error occurs
     */
    private String encodeImageToBase64(MultipartFile imageFile) throws IOException {
        byte[] imageBytes = imageFile.getBytes();
        return Base64.getEncoder().encodeToString(imageBytes);
    }

    /**
     * Gets the file extension from the file name.
     *
     * @param fileName the file name
     * @return the file extension
     */
    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    /**
     * Converts a HEIC image file to JPG format.
     *
     * @param heicStream the input stream of the HEIC file
     * @return the BufferedImage in JPG format
     * @throws IOException if an I/O error occurs
     */
    private BufferedImage convertHeicToJpg(InputStream heicStream) throws IOException {
        // Generate unique file names
        String uniqueFileName = UUID.randomUUID().toString();
        File tempHeicFile = File.createTempFile(uniqueFileName, ".heic");
        File tempJpgFile = File.createTempFile(uniqueFileName, ".jpg");

        // Save the HEIC input stream to a temp file
        Files.copy(heicStream, tempHeicFile.toPath(), StandardCopyOption.REPLACE_EXISTING);

        // Convert HEIC to JPG using heif-convert
        ProcessBuilder processBuilder = new ProcessBuilder("heif-convert", tempHeicFile.getAbsolutePath(), tempJpgFile.getAbsolutePath());
        Process process = processBuilder.start();
        try {
            process.waitFor();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("Conversion process was interrupted", e);
        }

        // Read the JPG file
        return ImageIO.read(tempJpgFile);
    }

}
