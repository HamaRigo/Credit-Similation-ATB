package dev.atb.Service;

import dev.atb.dto.OcrDTO;
import dev.atb.exceptions.OcrNotFoundException;
import dev.atb.exceptions.CompteNotFoundException;
import dev.atb.models.Ocr;
import dev.atb.models.Compte;
import dev.atb.repo.CompteRepository;
import dev.atb.repo.OcrRepository;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
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

    @Autowired
    private OcrRepository ocrRepository;

    @Autowired
    private CompteRepository compteRepository;

    private final String tesseractDataPath = "/path/to/tessdata"; // Replace with actual config

    public OcrDTO getOcrById(String id) {
        logger.debug("Fetching OCR entity with ID: {}", id);
        Ocr ocr = ocrRepository.findById(id)
                .orElseThrow(() -> new OcrNotFoundException("OCR entity with ID " + id + " not found"));
        return convertToDTO(ocr);
    }

    public List<OcrDTO> getAllOcrEntities() {
        logger.debug("Fetching all OCR entities");
        return ocrRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

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

    public OcrDTO analyzeAndSaveImage(MultipartFile file, String typeDocument, String numeroCompteId) {
        validateImageFile(file);

        try {
            BufferedImage bufferedImage = convertImageFile(file);
            String resultatsReconnaissance = performOcrOnImage(bufferedImage);

            Ocr ocrEntity = new Ocr();
            ocrEntity.setTypeDocument(typeDocument);
            ocrEntity.setResultatsReconnaissance(resultatsReconnaissance);

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

    public boolean deleteOcrById(String id) {
        if (ocrRepository.existsById(id)) {
            ocrRepository.deleteById(id);
            logger.debug("Deleted OCR entity with ID: {}", id);
            return true;
        } else {
            throw new OcrNotFoundException("OCR entity with ID " + id + " not found");
        }
    }

    private OcrDTO convertToDTO(Ocr ocr) {
        OcrDTO dto = new OcrDTO();
        BeanUtils.copyProperties(ocr, dto, "numeroCompte");
        // Add logic to handle numeroCompte if needed
        return dto;
    }

    private Ocr convertToEntity(OcrDTO dto) {
        Ocr ocr = new Ocr();
        BeanUtils.copyProperties(dto, ocr);
        // Add additional conversion logic if needed
        logger.debug("Converted OcrDTO to Ocr: {}", ocr);
        return ocr;
    }

    private void validateImageFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("The file is empty");
        }

        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("The file is not a valid image");
        }

        if (file.getSize() > 10 * 1024 * 1024) { // Limit size to 10 MB
            throw new IllegalArgumentException("The file size exceeds the maximum allowed size of 10 MB");
        }
    }

    private BufferedImage convertImageFile(MultipartFile file) throws IOException {
        String fileExtension = getFileExtension(file.getOriginalFilename());

        if ("heic".equalsIgnoreCase(fileExtension)) {
            return convertHeicToJpg(file.getInputStream());
        } else {
            return ImageIO.read(file.getInputStream());
        }
    }

    private String performOcrOnImage(BufferedImage image) throws TesseractException {
        ITesseract tesseract = new net.sourceforge.tess4j.Tesseract();
        tesseract.setDatapath(tesseractDataPath);
        return tesseract.doOCR(image);
    }

    private String encodeImageToBase64(MultipartFile imageFile) throws IOException {
        byte[] imageBytes = imageFile.getBytes();
        return Base64.getEncoder().encodeToString(imageBytes);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null || !fileName.contains(".")) {
            return "";
        }
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

    private BufferedImage convertHeicToJpg(InputStream heicStream) throws IOException {
        // Generate unique file names
        String uniqueFileName = UUID.randomUUID().toString();
        String heicFilePath = uniqueFileName + ".heic";
        String jpgFilePath = uniqueFileName + ".jpg";

        // Save the HEIC input stream to a temporary file
        Files.copy(heicStream, Paths.get(heicFilePath), StandardCopyOption.REPLACE_EXISTING);

        // Use ImageMagick to convert HEIC to JPG
        ProcessBuilder processBuilder = new ProcessBuilder(
                "magick", heicFilePath, jpgFilePath
        );

        // Execute the conversion command
        Process process = processBuilder.start();

        try {
            // Wait for the process to complete
            process.waitFor();
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Image conversion process was interrupted", e);
        }

        // Check if the conversion was successful
        File jpgFile = new File(jpgFilePath);
        if (!jpgFile.exists()) {
            throw new IOException("Failed to convert HEIC to JPG");
        }

        // Read the converted JPG file into a BufferedImage
        BufferedImage bufferedImage = ImageIO.read(jpgFile);

        // Clean up temporary files
        new File(heicFilePath).delete();
        jpgFile.delete();

        return bufferedImage;
    }
}
