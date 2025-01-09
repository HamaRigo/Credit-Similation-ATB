import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';

class ClientService {
    list_clients() {
        return axios.get(apiRoutes.LIST_CLIENT_URL);
    }

    add_client(data: object) {
        return axios.post(apiRoutes.ADD_CLIENT_URL, {
            data,
        });
    }

    edit_client(data: object, id: string) {
        return axios.put(apiRoutes.EDIT_CLIENT_URL + id, {
            data,
        });
    }

    delete_client(id: string) {
        return axios.delete(apiRoutes.DELETE_CLIENT_URL + id);
    }
}

export default new ClientService();