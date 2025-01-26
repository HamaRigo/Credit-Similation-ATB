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

    user_exists(username: string, email: string) {
        return axios.get(apiRoutes.USER_URL + `/exists`, {
            params: {
                username: username,
                email: email,
            },
        });
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

    change_password(data: object, oldPassword: string) {
        return axios.put(apiRoutes.USER_URL + '/password', data, {
            params: {
                oldPassword: oldPassword,
            },
        });
    }
}

export default new UserService();