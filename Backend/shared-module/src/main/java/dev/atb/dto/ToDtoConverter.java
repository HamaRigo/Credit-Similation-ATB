package dev.atb.dto;

import dev.atb.models.*;
import org.springframework.beans.BeanUtils;

import java.util.ArrayList;
import java.util.List;

public final class ToDtoConverter {
    public static ClientDTO clientToDto(final Client client) {
        return new ClientDTO(
                client.getCin(),
                client.getNom(),
                client.getPrenom(),
                client.getAdresse(),
                client.getNumeroTelephone()
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
        List<CreditDTO> creditDTOList = new ArrayList<>();
        if (compte.getCredits() != null) {
            for (Credit credit : compte.getCredits()) {
                CreditDTO creditDTO = creditToDto(credit);
                creditDTOList.add(creditDTO);
            }
            compteDTO.setCredits(creditDTOList);
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
                credit.getTauxInteret(),
                credit.getDuree(),
                credit.getMontant(),
                credit.getStatut(),
                creditModelToDto(credit.getModelDeCredit())
        );
    }

    public static CreditModelDTO creditModelToDto(final CreditModel creditModel) {
        return new CreditModelDTO(
                creditModel.getId(),
                creditModel.getFacteursDeRisque(),
                creditModel.getScores()
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
}
