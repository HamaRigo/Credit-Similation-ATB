package dev.atb.Service;

import dev.atb.dto.OcrDTO;
import dev.atb.models.Ocr;


import dev.atb.repo.OcrRepository;
import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OcrService {
    @Autowired
    private OcrRepository ocrRepository;

    public OcrDTO getOcrById(String id) {
        Ocr ocr = ocrRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("OCR not found"));
        return convertToDTO(ocr);
    }

    private OcrDTO convertToDTO(Ocr ocr) {
        return new OcrDTO(
        );
    }
}
