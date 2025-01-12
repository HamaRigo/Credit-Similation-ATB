import { TypeDocumentEnum } from "./TypeDocumentEnum";

export type ClientType = {
    id?: number;
    numeroDocument?: string;
    typeDocument?: TypeDocumentEnum;
    nom?: string;
    prenom?: string;
    adresse?: string;
    telephone?: string;
};
