package dev.atb.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "image")
public class OcrDTO {
    private Long id;
    private String typeDocument;
    private String resultatsReconnaissance;
    private boolean fraud;
    private String errorMessage;
    private String image;
    private double confidenceScore = 0.0;
    private CompteDTO compte;
}
