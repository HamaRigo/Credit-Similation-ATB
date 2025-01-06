package dev.atb.dto;

import dev.atb.models.*;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;

public final class ToDtoConverter {
    public static ClientDTO clientToDto(final Client client) {
        return new ClientDTO(
                client.getTypeDocument(),
                client.getNumeroDocument(),
                client.getNom(),
                client.getPrenom(),
                client.getAdresse(),
                client.getTelephone()
        );
    }

    public static CompteDTO compteToDto(final Compte compte) {
        CompteDTO compteDTO = new CompteDTO();
        BeanUtils.copyProperties(compte, compteDTO);

        List<OcrDTO> ocrDTOList = new ArrayList<>();
        if (compte.getOcrs() != null) {
            for (Ocr ocr : compte.getOcrs()) {
                OcrDTO ocrDTO = ocrToDto(ocr);
                ocrDTOList.add(ocrDTO);
            }
            compteDTO.setOcrs(ocrDTOList);
        }
        if (compte.getClient() != null) {
            ClientDTO clientDTO = clientToDto(compte.getClient());
            compteDTO.setClient(clientDTO);
        }

        return compteDTO;
    }

    public static CreditDTO creditToDto(final Credit credit) {
        return new CreditDTO(
                credit.getId(),
                credit.getType(),
                credit.getStatut(),
                credit.getTauxInteret(),
                credit.getMontant(),
                credit.getDateDebut(),
                credit.getDateFin(),
                credit.getPaiementMensuel(),
                clientToDto(credit.getClient())
        );
    }

    public static OcrDTO ocrToDto(final Ocr ocr) {
        return new OcrDTO(
                ocr.getId(),
                ocr.getTypeDocument(),
                ocr.getResultatsReconnaissance(),
                ocr.isFraude(),
                ocr.getImage(),
                ocr.getModelUsed()
        );
    }

    public static UserDTO userToDto(final User user) {
        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);

        List<RoleDTO> roleDTOList = new ArrayList<>();
        if (user.getRoles() != null) {
            for (Role role : user.getRoles()) {
                RoleDTO roleDTO = roleToDto(role);
                roleDTOList.add(roleDTO);
            }
            userDTO.setRoles(roleDTOList);
        }

        return userDTO;
    }

    public static RoleDTO roleToDto(final Role role) {
        return new RoleDTO(
          role.getId(),
          role.getName()
        );
    }
}
