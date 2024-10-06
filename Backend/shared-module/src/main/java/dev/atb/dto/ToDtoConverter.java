package dev.atb.dto;

import dev.atb.models.*;
import java.util.List;
import java.util.stream.Collectors;

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
        // Mapping the fields based on your updated Compte model
        CompteDTO compteDTO = new CompteDTO(
                compte.getNumeroCompte(),   // Use numeroCompte instead of id
                compte.getSolde(),
                compte.getTypeCompte(),      // Use typeCompte
                null, // Client to be set below
                null, // OCRs to be set below
                null  // Credits to be set below
        );

        // Convert Ocr list using streams
        List<OcrDTO> ocrDTOList = (compte.getOcrs() != null) ?
            compte.getOcrs().stream()
                .map(ToDtoConverter::ocrToDto)
                .collect(Collectors.toList()) : null;
        compteDTO.setOcrs(ocrDTOList);

        // Convert Credit list using streams
        List<CreditDTO> creditDTOList = (compte.getCredits() != null) ?
            compte.getCredits().stream()
                .map(ToDtoConverter::creditToDto)
                .collect(Collectors.toList()) : null;
        compteDTO.setCredits(creditDTOList);

        // Convert Client if present
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
                ocr.isFraud(),
                ocr.getImage(),
                ocr.getModelUsed()
        );
    }
}
