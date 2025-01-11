import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';
import {ClientType} from "../types/ClientType";

class ClientService {
    list_clients() {
        return axios.get(apiRoutes.LIST_CLIENT_URL);
    }

    get_client(id: string) {
        return axios.get(apiRoutes.ADD_CLIENT_URL+ `/${id}`).catch((error) => {
            if (error.response && error.response.status === 404) {
                return null; // Return null if client not found
            }
            throw error;
        });
    }

    add_client(data: object) {
        return axios.post(apiRoutes.ADD_CLIENT_URL, data);
    }

    edit_client(data: object) {
        return axios.put(apiRoutes.EDIT_CLIENT_URL, data);
    }

    delete_client(id: string) {
        return axios.delete(apiRoutes.DELETE_CLIENT_URL + `/${id}`);
    }
}

export default new ClientService();