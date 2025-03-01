package dev.atb.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private boolean activated;
    private List<RoleDTO> roles;
}
