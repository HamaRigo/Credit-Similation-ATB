import axios, { AxiosResponse } from 'axios';
import { apiRoutes } from '../routes/backend-config';

// Define the Client data model
export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  [key: string]: any; // Additional fields as needed
}

class ClientService {
  // Fetch the list of clients
  list_clients(): Promise<AxiosResponse<Client[]>> {
    return axios.get<Client[]>(apiRoutes.LIST_CLIENT_URL);
    }

  // Add a new client
  add_client(data: Client): Promise<AxiosResponse<Client>> {
    return axios.post<Client>(apiRoutes.ADD_CLIENT_URL, data);
    }

  // Edit an existing client
  edit_client(data: Partial<Client>, id: string): Promise<AxiosResponse<Client>> {
    return axios.put<Client>(`${apiRoutes.EDIT_CLIENT_URL}${id}`, data);
    }

  // Delete a client by ID
  delete_client(id: string): Promise<void> {
    return axios.delete(`${apiRoutes.DELETE_CLIENT_URL}${id}`);
    }
}

export default new ClientService();