import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';

class CreditService {
    list_credits() {
        return axios.get(apiRoutes.CREDIT_URL);
    }

    count_credits_by_type() {
        return axios.get(apiRoutes.CREDIT_URL + `/countByType`);
    }

    get_credit(id: number) {
        return axios.get(apiRoutes.CREDIT_URL + `/${id}`);
    }

    add_credit(data: any) {
        return axios.post(apiRoutes.CREDIT_URL, data);
    }

    edit_credit(data: any) {
        return axios.put(apiRoutes.CREDIT_URL, data);
    }

    delete_credit(id: number) {
        return axios.delete(apiRoutes.CREDIT_URL + `/${id}`);
    }
}

export default new CreditService();