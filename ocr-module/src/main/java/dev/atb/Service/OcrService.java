package dev.atb.Service;


import dev.atb.dto.OcrDTO;
import dev.atb.models.Ocr;
import dev.atb.models.Compte;
import dev.atb.repo.CompteRepository;
import dev.atb.repo.OcrRepository;
import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.TesseractException;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.bytedeco.tesseract.Tesseract;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OcrService {

    @Autowired
    private OcrRepository ocrRepository;

    @Autowired
    private CompteRepository compteRepository;

    public OcrDTO getOcrById(String id) {
        Ocr ocr = ocrRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("OCR not found"));
        return convertToDTO(ocr);
    }

    public List<OcrDTO> getAllOcrEntities() {
        List<Ocr> ocrs = ocrRepository.findAll();
        return ocrs.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OcrDTO performOcr(MultipartFile imageFile) {
        try {
            ITesseract tesseract = (ITesseract) new Tesseract();
            tesseract.setDatapath("/path/to/tessdata"); // Change this to your tessdata directory path

            BufferedImage bufferedImage = ImageIO.read(imageFile.getInputStream());
            String ocrResult = tesseract.doOCR(bufferedImage);

            OcrDTO ocrDTO = new OcrDTO();
            ocrDTO.setResultatsReconnaissance(ocrResult);

            byte[] imageBytes = imageFile.getBytes();
            String base64Image = Base64.getEncoder().encodeToString(imageBytes);
            ocrDTO.setImage(base64Image);

            Ocr ocrEntity = convertToEntity(ocrDTO);
            ocrEntity = ocrRepository.save(ocrEntity);

            return convertToDTO(ocrEntity);
        } catch (TesseractException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error performing OCR: " + e.getMessage());
        }
    }

    public Ocr createOcrEntity(Ocr ocrEntity) {
        return ocrRepository.save(ocrEntity);
    }

    private OcrDTO convertToDTO(Ocr ocr) {
        OcrDTO dto = new OcrDTO();
        BeanUtils.copyProperties(ocr, dto, "numeroCompte"); // Exclude conflicting property
        if (ocr.getNumeroCompte() != null) {
            dto.setNumeroCompte(ocr.getNumeroCompte().getNumeroCompte());
        }
        return dto;
    }


    private Ocr convertToEntity(OcrDTO dto) {
        Ocr ocr = new Ocr();
        BeanUtils.copyProperties(dto, ocr);
        if (dto.getNumeroCompte() != null) {
            Compte compte = compteRepository.findById(dto.getNumeroCompte())
                    .orElseThrow(() -> new ResourceNotFoundException("Compte not found"));
            ocr.setNumeroCompte(compte);
        }
        return ocr;
    }

    public boolean deleteOcrById(String id) {
        Optional<Ocr> ocrOptional = ocrRepository.findById(id);
        if (ocrOptional.isPresent()) {
            ocrRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    public OcrDTO analyzeAndSaveImage(MultipartFile file, String typeDocument, String numeroCompteId) {
        try {
            ITesseract tesseract = (ITesseract) new Tesseract();
            tesseract.setDatapath("/path/to/tessdata");

            BufferedImage bufferedImage = ImageIO.read(file.getInputStream());
            String resultatsReconnaissance = tesseract.doOCR(bufferedImage);

            Ocr ocrEntity = new Ocr();
            ocrEntity.setTypeDocument(typeDocument);
            ocrEntity.setResultatsReconnaissance(resultatsReconnaissance);

            if (numeroCompteId != null) {
                Compte compte = compteRepository.findById(numeroCompteId)
                        .orElseThrow(() -> new ResourceNotFoundException("Compte not found"));
                ocrEntity.setNumeroCompte(compte);
            }

            ocrRepository.save(ocrEntity);

            return convertToDTO(ocrEntity);
        } catch (TesseractException | IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error analyzing and saving image: " + e.getMessage());
        }
    }
}
