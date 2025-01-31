package dev.atb.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CompteCountByMonthDTO {
    private String month;
    private Long count;
}
