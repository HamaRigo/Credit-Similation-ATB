import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';

class RoleService {
    list_roles() {
        return axios.get(apiRoutes.ROLE_URL);
    }

    role_exists(name: string) {
        return axios.get(apiRoutes.ROLE_URL + '/exists', {
            params: {
                name: name,
            },
        });
    }

    add_role(data: object) {
        return axios.post(apiRoutes.ROLE_URL, data);
    }

    edit_role(data: object) {
        return axios.put(apiRoutes.ROLE_URL, data);
    }

    delete_role(id: number) {
        return axios.delete(apiRoutes.ROLE_URL + `/${id}`);
    }
}

export default new RoleService();