import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';

class ClientService {
    list_clients() {
        return axios.get(apiRoutes.CLIENT_URL);
    }

    get_client(id: number) {
        return axios.get(apiRoutes.CLIENT_URL+ `/${id}`);
    }

    client_exists(numeroDocument: string) {
        return axios.get(apiRoutes.CLIENT_URL+ `/exists/${numeroDocument}`);
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
}

export default new ClientService();