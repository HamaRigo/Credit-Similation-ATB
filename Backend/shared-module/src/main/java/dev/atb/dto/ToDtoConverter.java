package dev.atb.dto;

import dev.atb.models.*;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;

public final class ToDtoConverter {

    private ToDtoConverter() {
        // Prevent instantiation
    }

    public static ClientDTO clientToDto(final Client client) {
        if (client == null) {
            return null;
        }

        ClientDTO clientDTO = new ClientDTO();
        BeanUtils.copyProperties(client, clientDTO);

        // Compute compteCount
        clientDTO.setCompteCount(client.getComptes() != null ? client.getComptes().size() : 0);

        return clientDTO;
    }

    public static CompteDTO compteToDto(final Compte compte) {
        if (compte == null) {
            return null;
        }

        CompteDTO compteDTO = new CompteDTO();
        BeanUtils.copyProperties(compte, compteDTO);

        // Populate OCRs
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
        if (credit == null) {
            return null;
        }

        return new CreditDTO(
                credit.getId(),
                credit.getType(),
                credit.getStatus(),
                credit.getTauxInteret(),
                credit.getMontant(),
                credit.getDateDebut(),
                credit.getDateFin(),
                credit.getPaiementMensuel(),
                clientToDto(credit.getClient())
        );
    }

    public static OcrDTO ocrToDto(final Ocr ocr) {
        if (ocr == null) {
            return null;
        }

        return new OcrDTO(
                ocr.getId(),                           // ✅ Corrected: Added missing `id`
                ocr.getNumeroCompte(),                // ✅ Corrected: Ensure correct order
                ocr.getTypeDocument(),
                ocr.getResultatsReconnaissance(),
                ocr.isFraud(),
                ocr.getImage(),
                ocr.getModelUsed(),
                null, // ✅ Error message (default null)
                0.0   // ✅ Confidence score (default 0.0)
        );
    }

    public static UserDTO userToDto(final User user) {
        if (user == null) {
            return null;
        }

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);

        // Populate roles
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
        RoleDTO roleDTO = new RoleDTO();
        BeanUtils.copyProperties(role, roleDTO);
        roleDTO.setUserCount(role.getUsers() != null ? role.getUsers().size() : 0);

        return roleDTO;
    }
}
