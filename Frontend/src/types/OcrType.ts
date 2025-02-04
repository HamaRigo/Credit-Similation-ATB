import {TypeOcrEnum} from "./TypeOcrEnum";

export type OcrType = {
    id?: number;
    typeDocument?: TypeOcrEnum;
    resultatsReconnaissance?: string;
    fraud?: boolean;
    errorMessage?: string;
    confidenceScore?: string;
    compte?: any;
}
