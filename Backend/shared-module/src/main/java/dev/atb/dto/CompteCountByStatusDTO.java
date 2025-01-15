package dev.atb.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CompteCountByStatusDTO {
    private boolean activated;
    private Long count;
}
