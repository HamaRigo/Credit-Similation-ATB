import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';

class OcrService {
    list_ocrs() {
        return axios.get(apiRoutes.OCR_URL);
    }

    get_ocr(id: number) {
        return axios.get(apiRoutes.OCR_URL + `/${id}`);
    }

    delete_ocr(id: number) {
        return axios.delete(apiRoutes.OCR_URL + `/${id}`);
    }
}

export default new OcrService();