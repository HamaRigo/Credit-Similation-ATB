import axios from 'axios';
import { apiRoutes } from '../routes/backend-config';

class ClientService {
    async list_clients() {
        try {
            return await axios.get(apiRoutes.LIST_CLIENT_URL);
        } catch (error) {
            console.error('Error fetching client list:', error);
            throw error;
        }
    }

    async add_client(data: object) {
        try {
            return await axios.post(apiRoutes.ADD_CLIENT_URL, data);
        } catch (error) {
            console.error('Error adding client:', error);
            throw error;
        }
    }

    async edit_client(data: object, id: string) {
        try {
            return await axios.put(`${apiRoutes.EDIT_CLIENT_URL}/${id}`, data);
        } catch (error) {
            console.error(`Error editing client with ID ${id}:`, error);
            throw error;
        }
    }

    async delete_client(id: string) {
        try {
            return await axios.delete(`${apiRoutes.DELETE_CLIENT_URL}/${id}`);
        } catch (error) {
            console.error(`Error deleting client with ID ${id}:`, error);
            throw error;
        }
    }
}

export default new ClientService();