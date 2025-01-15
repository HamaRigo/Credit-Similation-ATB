package dev.atb.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CompteCountByTypeDTO {
    private String typeCompte;
    private Long count;
}
