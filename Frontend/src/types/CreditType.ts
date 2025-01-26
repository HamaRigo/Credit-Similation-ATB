import { TypeCreditEnum } from "./TypeCreditEnum";
import { StatusCreditEnum } from "./StatusCreditEnum";

export type CreditType = {
    id?: number;
    type?: TypeCreditEnum;
    status?: StatusCreditEnum;
    tauxInteret?: number;
    montant?: number;
    period?: number;
    paiementMensuel?: number;
    client?: any;
};
