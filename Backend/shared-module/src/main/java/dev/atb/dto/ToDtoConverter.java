package dev.atb.dto;

import dev.atb.models.*;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;

public final class ToDtoConverter {
    public static ClientDTO clientToDto(final Client client) {
        ClientDTO clientDTO = new ClientDTO();
        BeanUtils.copyProperties(client, clientDTO);
        clientDTO.setCompteCount(client.getComptes() != null ? client.getComptes().size() : 0);
        clientDTO.setCreditCount(client.getCredits() != null ? client.getCredits().size() : 0);

        List<CompteDTO> compteDTOList = new ArrayList<>();
        if (client.getComptes() != null) {
            for (Compte compte : client.getComptes()) {
                CompteDTO compteDTO = compteToDto(compte, true);
                compteDTOList.add(compteDTO);
            }
            clientDTO.setComptes(compteDTOList);
        }

        List<CreditDTO> creditDTOList = new ArrayList<>();
        if (client.getCredits() != null) {
            for (Credit credit : client.getCredits()) {
                CreditDTO creditDTO = creditToDto(credit, true);
                creditDTOList.add(creditDTO);
            }
            clientDTO.setCredits(creditDTOList);
        }

        return clientDTO;
    }

    public static CompteDTO compteToDto(final Compte compte) {
        return compteToDto(compte, false);
    }

    public static CompteDTO compteToDto(final Compte compte, boolean withoutClient) {
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

        if (!withoutClient && compte.getClient() != null) {
            ClientDTO clientDTO = clientToDto(compte.getClient());
            compteDTO.setClient(clientDTO);
        }

        return compteDTO;
    }

    public static CreditDTO creditToDto(final Credit credit) {
        return creditToDto(credit, false);
    }

    public static CreditDTO creditToDto(final Credit credit, boolean withoutClient) {
        return new CreditDTO(
                credit.getId(),
                credit.getType(),
                credit.getStatus(),
                credit.getTauxInteret(),
                credit.getMontant(),
                credit.getPeriod(),
                credit.getPaiementMensuel(),
                withoutClient ? null : clientToDto(credit.getClient()),
                credit.getStartDate()
        );
    }

    public static OcrDTO ocrToDto(final Ocr ocr) {
        return new OcrDTO(
                ocr.getNumeroCompte(),
                ocr.getTypeDocument(),
                ocr.getResultatsReconnaissance(),
                ocr.isFraud(),
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
        RoleDTO roleDTO = new RoleDTO();
        BeanUtils.copyProperties(role, roleDTO);
        roleDTO.setUserCount(role.getUsers() != null ? role.getUsers().size() : 0);

        return roleDTO;
    }
}
