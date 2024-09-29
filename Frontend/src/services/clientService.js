import axios from 'axios';

const API_URL = 'http://localhost:4444'; // Replace with your Spring Boot server URL

const getClients = () => {
    return axios.get(`${API_URL}/clients`);
};

const createClient = (client) => {
    return axios.post(`${API_URL}/clients`, client);
};

const getClient = (cin) => {
    return axios.get(`${API_URL}/clients/${cin}`);
};

const updateClient = (cin, client) => {
    return axios.put(`${API_URL}/clients/${cin}`, client);
};

const deleteClient = (cin) => {
    return axios.delete(`${API_URL}/clients/${cin}`);
};


    const checkClientExists = async (cin) => {
        try {
            const response = await axios.head(`${API_URL}/clients/${cin}`);
            if (response.status === 200) {
                return 'Client with this CIN already exists.'; // Return message if client exists
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return false; // Client does not exist, proceed to add
            }
            throw error; // Re-throw other errors
        }





};



export { createClient, getClients, getClient, updateClient, deleteClient, checkClientExists };
