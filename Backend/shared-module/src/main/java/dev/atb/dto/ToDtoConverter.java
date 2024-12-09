package dev.atb.dto;

import dev.atb.models.*;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Utility class for converting model entities to their respective DTO representations.
 */
public final class ToDtoConverter {

    /**
     * Converts a `Client` model to `ClientDTO`.
     *
     * @param client The `Client` model to convert.
     * @return The converted `ClientDTO`.
     */
    public static ClientDTO clientToDto(final Client client) {
        return new ClientDTO(
                client.getCin(),
                client.getNom(),
                client.getPrenom(),
                client.getAdresse(),
                client.getNumeroTelephone(),
                client.getSignature()
        );
    }

    /**
     * Converts a `Compte` model to `CompteDTO`, including nested DTOs for associated OCR and Credit entities.
     *
     * @param compte The `Compte` model to convert.
     * @return The converted `CompteDTO`.
     */
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


        // Convert associated Credit entities
        List<CreditDTO> creditDTOList = (compte.getCredits() != null) ?
            compte.getCredits().stream()
                .map(ToDtoConverter::creditToDto)
                .collect(Collectors.toList()) : null;
        compteDTO.setCredits(creditDTOList);

        // Convert associated Client entity
        if (compte.getClient() != null) {
            ClientDTO clientDTO = clientToDto(compte.getClient());
            compteDTO.setClient(clientDTO);
        }

        return compteDTO;
    }

    /**
     * Converts a `Credit` model to `CreditDTO`, including nested DTO for `CreditModel`.
     *
     * @param credit The `Credit` model to convert.
     * @return The converted `CreditDTO`.
     */
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

    /**
     * Converts a `CreditModel` model to `CreditModelDTO`.
     *
     * @param creditModel The `CreditModel` model to convert.
     * @return The converted `CreditModelDTO`.
     */
    public static CreditModelDTO creditModelToDto(final CreditModel creditModel) {
        return new CreditModelDTO(
                creditModel.getId(),
                creditModel.getFacteursDeRisque(),
                creditModel.getScores()
        );
    }

    /**
     * Converts an `Ocr` model to `OcrDTO`.
     *
     * @param ocr The `Ocr` model to convert.
     * @return The converted `OcrDTO`.
     */
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
}
