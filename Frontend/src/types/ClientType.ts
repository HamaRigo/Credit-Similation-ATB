import { TypeDocumentEnum } from "./TypeDocumentEnum";
import {CompteType} from "./CompteType";
import {CreditType} from "./CreditType";

export type ClientType = {
    id?: number;
    numeroDocument?: string;
    typeDocument?: TypeDocumentEnum;
    nom?: string;
    prenom?: string;
    adresse?: string;
    telephone?: string;
    signature?: string;
    compteCount?: number;
    creditCount?: number;
    comptes?: CompteType[];
    credits?: CreditType[];
};
