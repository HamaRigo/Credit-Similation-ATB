package dev.atb.dto;

import dev.atb.models.CreditType;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CreditCountByTypeDTO {
    private CreditType type;
    private Long count;
}
