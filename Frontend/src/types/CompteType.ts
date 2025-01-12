import { TypeCompteEnum } from "./TypeCompteEnum";

export type CompteType = {
    id?: number;
    typeCompte?: TypeCompteEnum;
    numeroCompte?: string;
    solde?: number;
    tauxInteret?: number;
    soldeMinimum?: number;
    activated?: boolean;
    client?: any;
    //ocr?: OcrType[];
};
