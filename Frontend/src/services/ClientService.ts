import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';

class ClientService {
    list_clients() {
        return axios.get(apiRoutes.CLIENT_URL);
    }

    count_clients() {
        return axios.get(apiRoutes.CLIENT_URL + '/count');
    }

    get_client(id: number) {
        return axios.get(apiRoutes.CLIENT_URL + `/${id}`);
    }

    client_exists(numeroDocument: string) {
        return axios.get(apiRoutes.CLIENT_URL + '/exists', {
            params: {
                numeroDocument: numeroDocument,
            },
        });
    }

    add_client(data: object) {
        return axios.post(apiRoutes.CLIENT_URL, data);
    }

    edit_client(data: object) {
        return axios.put(apiRoutes.CLIENT_URL, data);
    }

    delete_client(id: number) {
        return axios.delete(apiRoutes.CLIENT_URL + `/${id}`);
    }

    upload_signature(id: number, data: object) {
        return axios.post(apiRoutes.CLIENT_URL + `/${id}/signature`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    }

    get_signature(id: number) {
        return axios.get(apiRoutes.CLIENT_URL + `/${id}/signature`, {
            responseType: "blob"
        });
    }

    delete_signature(id: number) {
        return axios.delete(apiRoutes.CLIENT_URL + `/${id}/signature`);
    }
}

export default new ClientService();