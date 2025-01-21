import axios from 'axios';
import { apiRoutes } from "../routes/backend-config";

class OcrServiceNew {
    list_ocrs() {
        return axios.get(apiRoutes.OCR_URL);
    }
}

export default new OcrServiceNew();
