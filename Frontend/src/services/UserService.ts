import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';

class UserService {
    list_users() {
        return axios.get(apiRoutes.USER_URL);
    }

    count_users() {
        return axios.get(apiRoutes.USER_URL + `/count`);
    }

    get_user(id: number) {
        return axios.get(apiRoutes.USER_URL + `/${id}`);
    }

    add_user(data: object) {
        return axios.post(apiRoutes.USER_URL, data);
    }

    edit_user(data: object) {
        return axios.put(apiRoutes.USER_URL, data);
    }

    delete_user(id: number) {
        return axios.delete(apiRoutes.USER_URL + `/${id}`);
    }
}

export default new UserService();