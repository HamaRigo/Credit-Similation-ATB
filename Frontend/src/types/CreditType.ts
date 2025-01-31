import { StatusCreditEnum } from "./StatusCreditEnum";

export type CreditType = {
    id?: number;
    type?: string;
    status?: StatusCreditEnum;
    tauxInteret?: number;
    montant?: number;
    period?: number;
    paiementMensuel?: number;
    client?: any;
    startDate?: Date;
};
