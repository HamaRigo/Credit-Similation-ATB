class Credit {
    constructor(id, montant, tauxInteret, duree, statut, numeroCompte, modeldecredit) {
        this.id = id;
        this.montant = montant;
        this.tauxInteret = tauxInteret;
        this.duree = duree;
        this.statut = statut;
        this.numeroCompte = numeroCompte;
        this.modeldecredit = modeldecredit;
    }

    static fromDTO(dto) {
        const { id, montant, tauxInteret, duree, statut, numeroCompte, modeldecredit } = dto;
        return new Credit(id, montant, tauxInteret, duree, statut, numeroCompte, CreditModel.fromDTO(modeldecredit));
    }

    toDTO() {
        const { id, montant, tauxInteret, duree, statut, numeroCompte, modeldecredit } = this;
        return { id, montant, tauxInteret, duree, statut, numeroCompte, modeldecredit: modeldecredit.toDTO() };
    }
}

class CreditModel {
    constructor(id, facteursDeRisque, scores, creditId) {
        this.id = id;
        this.facteursDeRisque = facteursDeRisque;
        this.scores = scores;
        this.creditId = creditId;
    }

    static fromDTO(dto) {
        const { id, facteursDeRisque, scores, creditId } = dto;
        return new CreditModel(id, facteursDeRisque, scores, creditId);
    }

    toDTO() {
        const { id, facteursDeRisque, scores, creditId } = this;
        return { id, facteursDeRisque, scores, creditId };
    }
}

export { Credit, CreditModel };
