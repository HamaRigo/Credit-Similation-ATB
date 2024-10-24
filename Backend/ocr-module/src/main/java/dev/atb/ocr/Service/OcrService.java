package dev.atb.ocr.Service;

import dev.atb.dto.OcrDTO;
import dev.atb.ocr.config.OcrConfig;
import dev.atb.ocr.exceptions.OcrProcessingException;
import dev.atb.models.Ocr;
import dev.atb.repo.OcrRepository;
import dev.atb.repo.CompteRepository;
import org.opencv.core.Core;
import org.opencv.core.Mat;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
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
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class OcrService {

    private static final Logger logger = LoggerFactory.getLogger(OcrService.class);

    private final OcrRepository ocrRepository;
    private final CompteRepository compteRepository;
    private final OcrConfig ocrConfig;
    // Load OpenCV library for image processing
    static {
        System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
    }

    @Autowired
    public OcrService(OcrRepository ocrRepository, CompteRepository compteRepository, OcrConfig ocrConfig) {
        this.ocrRepository = ocrRepository;
        this.compteRepository = compteRepository;
        this.ocrConfig = ocrConfig;
    }

    // Perform OCR using Tesseract
    public String performOcrWithTesseract(File file) {
        try {
            validateInputFile(file);

            // Define the output file name without extension
            String outputFileName = file.getName().substring(0, file.getName().lastIndexOf('.'));
            File outputFile = new File(file.getParent(), outputFileName);

            // Command to execute Tesseract
            ProcessBuilder processBuilder = new ProcessBuilder("tesseract", file.getAbsolutePath(), outputFile.getAbsolutePath());

            Process process = processBuilder.start();

            // Timeout for process
            if (!process.waitFor(60, TimeUnit.SECONDS)) {
                process.destroy(); // Forcefully terminate the process if it times out
                throw new OcrProcessingException("Tesseract process timed out");
            }

            int exitCode = process.waitFor();

            if (exitCode != 0) {
                throw new OcrProcessingException("Tesseract process failed with exit code: " + exitCode);
            }

            // Read and return the OCR results
            return new String(Files.readAllBytes(new File(outputFile.getAbsolutePath() + ".txt").toPath()));

        } catch (Exception e) {
            logger.error("Error during OCR processing for file: {}", file.getName(), e);
            throw new OcrProcessingException("Error occurred while processing OCR", e);
        }
    }

    /**
     * Analyze and save the image provided as a MultipartFile, including saving the image to the database.
     *
     * @param imageFile the image file to process
     * @param typeDocument the type of document being processed (optional)
     * @param numeroCompteId the account ID associated with the document (optional)
     * @param signatureBase64 Base64 encoded signature for verification
     * @return OcrDTO containing the OCR results
     */

    public OcrDTO analyzeAndSaveImage(MultipartFile imageFile, String typeDocument, String numeroCompteId, String signatureBase64) {
        File tempFile = null;
        try {
            // Save image to a temporary file
            String originalFileName = imageFile.getOriginalFilename();
            String fileExtension = getFileExtension(originalFileName);
            tempFile = File.createTempFile("temp", "." + fileExtension);
            imageFile.transferTo(tempFile);

            // Convert PDFs to TIFF if necessary

        if ("pdf".equalsIgnoreCase(fileExtension)) {
                tempFile = convertPdfToTiff(tempFile); // Optional if you're handling PDFs
        }

            // Perform OCR using Tesseract
        validateInputFile(tempFile);
        String ocrResult = performOcrWithTesseract(tempFile);
        Ocr ocr = new Ocr();
        ocr.setResultatsReconnaissance(ocrResult);
        ocr.setTypeDocument(typeDocument);

            // Convert image to Base64 and save in the database
        byte[] imageBytes = imageFile.getBytes();
        String base64Image = Base64.getEncoder().encodeToString(imageBytes);
        ocr.setImage(base64Image); // Store Base64 encoded string

        if (numeroCompteId != null) {
            compteRepository.findById(numeroCompteId).ifPresent(ocr::setCompte);
        }

            // Signature Verification
            File signatureFile = convertBase64ToImageFile(signatureBase64, "signature");
            String savedSignaturePath = getSavedSignaturePath(numeroCompteId);
            String verificationResult = verifySignature(signatureFile.getAbsolutePath(), savedSignaturePath);

            boolean isFraud = verificationResult.equalsIgnoreCase("fraud");
            ocr.setFraud(isFraud);
            ocrRepository.save(ocr); // Save OCR results to the database
            logger.info("OCR results saved successfully for file: {}", originalFileName);
        return convertToOcrDTO(ocr);
    } catch (IOException e) {
        logger.error("Error processing image file: {}", imageFile.getOriginalFilename(), e);
        throw new OcrProcessingException("Error occurred while processing image", e);
    } finally {
        cleanupTemporaryFiles(tempFile);
    }
}

    // Helper Methods

    // Perform Signature Verification (merged from SignatureVerificationService)
    private String verifySignature(String inputImagePath, String savedSignaturePath) throws IOException {
        Mat inputImage = Imgcodecs.imread(inputImagePath);
        Mat savedSignature = Imgcodecs.imread(savedSignaturePath);

        // Convert to grayscale and apply binary thresholding
        Mat inputGray = new Mat();
        Mat signatureGray = new Mat();
        Imgproc.cvtColor(inputImage, inputGray, Imgproc.COLOR_BGR2GRAY);
        Imgproc.cvtColor(savedSignature, signatureGray, Imgproc.COLOR_BGR2GRAY);
        Imgproc.threshold(inputGray, inputGray, 128, 255, Imgproc.THRESH_BINARY);
        Imgproc.threshold(signatureGray, signatureGray, 128, 255, Imgproc.THRESH_BINARY);

        // Compare the two images
        double similarity = Imgproc.matchShapes(inputGray, signatureGray, Imgproc.CV_CONTOURS_MATCH_I1, 0);

        // Return fraud or not fraud based on similarity threshold
        return similarity < 0.5 ? "fraud" : "not fraud";
    }


    // Method to convert PDF to TIFF
    private File convertPdfToTiff(File pdfFile) throws IOException {
        // Implement your PDF to TIFF conversion logic here
        // This is a placeholder. You might need a library like Apache PDFBox.
        File tiffFile = new File(pdfFile.getAbsolutePath().replace(".pdf", ".tiff"));
        // Conversion logic here
        return tiffFile;
    }

    private void validateInputFile(File file) throws IOException {
        if (!file.exists() || file.length() == 0) {
            throw new IOException("Input file is invalid or empty: " + file.getAbsolutePath());
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
            logger.info("Updated OCR record with ID: {}", id);
            return convertToOcrDTO(ocr);
        } else {
            logger.error("OCR record with ID {} not found.", id);
            throw new OcrProcessingException("OCR record not found");
        }
    }
    private String getSavedSignaturePath(String numeroCompteId) {
        // Logic to get the saved signature path based on account ID
        return "path/to/saved/signature"; // Placeholder implementation
    }

    private File convertBase64ToImageFile(String base64, String fileName) throws IOException {
        byte[] imageBytes = Base64.getDecoder().decode(base64);
        File file = new File(System.getProperty("java.io.tmpdir"), fileName + ".png");
        Files.write(file.toPath(), imageBytes);
        return file;
    }

    private String getFileExtension(String fileName) {
        return fileName.substring(fileName.lastIndexOf('.') + 1);
    }

}
