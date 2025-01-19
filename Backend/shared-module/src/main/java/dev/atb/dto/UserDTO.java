package dev.atb.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private List<RoleDTO> roles;
}
