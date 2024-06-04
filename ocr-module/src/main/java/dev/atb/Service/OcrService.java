package dev.atb.Service;

import dev.atb.dto.OcrDTO;
import dev.atb.models.Ocr;
import dev.atb.repo.OcrRepository;
//import net.sourceforge.tess4j.ITesseract;
//import net.sourceforge.tess4j.Tesseract;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class OcrService {

    @Autowired
    private OcrRepository ocrRepository;

    public OcrDTO getOcrById(String id) {
        Ocr ocr = ocrRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("OCR not found"));
        return convertToDTO(ocr);
    }

    public List<Ocr> getAllOcrEntities() {
        return ocrRepository.findAll();
    }

//    public OcrDTO performOcr(MultipartFile imageFile) {
//        try {
//            // Initialize Tesseract OCR engine
//            ITesseract tesseract = new Tesseract();
//            // Set the path to the tessdata directory (containing language data files)
//            tesseract.setDatapath("/path/to/tessdata"); // Change this to your tessdata directory path
//
//            // Perform OCR on the image bytes
//            String ocrResult = tesseract.doOCR(imageFile.getInputStream());
//
//            // Create an OcrDTO object with the OCR result
//            OcrDTO ocrDTO = new OcrDTO();
//            ocrDTO.setResultatsReconnaissance(ocrResult);
//
//            // Convert image file to base64 string
//            byte[] imageBytes = imageFile.getBytes();
//            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
//            ocrDTO.setImage(base64Image);
//
//            // Save the OCR result and image to the database
//            Ocr ocrEntity = convertToEntity(ocrDTO);
//            ocrEntity = ocrRepository.save(ocrEntity);
//
//            return convertToDTO(ocrEntity);
//        } catch (IOException e) {
//            // Handle OCR errors
//            e.printStackTrace();
//            throw new RuntimeException("Error performing OCR: " + e.getMessage());
//        }
//    }

    public Ocr createOcrEntity(Ocr ocrEntity) {
        return ocrRepository.save(ocrEntity);
    }

    private OcrDTO convertToDTO(Ocr ocr) {
        OcrDTO dto = new OcrDTO();
        BeanUtils.copyProperties(ocr, dto);
        return dto;
    }

    private Ocr convertToEntity(OcrDTO dto) {
        Ocr ocr = new Ocr();
        BeanUtils.copyProperties(dto, ocr);
        return ocr;
    }

    public boolean deleteOcrById(String id) {
        Optional<Ocr> ocrOptional = ocrRepository.findById(id);
        if (ocrOptional.isPresent()) {
            ocrRepository.deleteById(id);
            return true;
        } else {
            return false; // If the OCR with the given ID doesn't exist
        }
    }

    public OcrDTO analyzeAndSaveImage(MultipartFile file, String typeDocument, String numeroCompte) {
        try {
            // Analyze the image using OCR
            ITesseract tesseract = new Tesseract();
            String resultatsReconnaissance = tesseract.doOCR(file.getInputStream());

            // Create an Ocr entity
            Ocr ocrEntity = new Ocr();
            ocrEntity.setId(UUID.randomUUID().toString()); // Generate a unique ID
            ocrEntity.setTypeDocument(typeDocument);
            ocrEntity.setResultatsReconnaissance(resultatsReconnaissance);
            ocrEntity.setNumeroCompte(numeroCompte);

            // Save the Ocr entity to the database
            ocrRepository.save(ocrEntity);

            // Convert the Ocr entity to OcrDTO and return it
            return convertToDTO(ocrEntity);
        } catch (IOException e) {
            // Handle IO exception (e.g., if the file cannot be read)
            e.printStackTrace();
            // You may want to throw a custom exception here or return an error response
            return null;
        }
    }

}