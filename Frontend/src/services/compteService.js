import axios from 'axios';

const API_URL = 'http://localhost:5555'; // Replace with your Spring Boot server URL

 const getClientsByCins = async (cins) => {
    return axios.post(`${API_URL}/clients/byCins`, cins);
};
const getComptes = () => {
    return axios.get(`${API_URL}/comptes`);
};

const createCompte = (compte) => {
    return axios.post(`${API_URL}/comptes`, compte);
};

const getCompte = async (numeroCompte) => {
    try {
        const response = await axios.get(`http://localhost:5555/comptes/${numeroCompte}`);
        return response.data; // Return the data part of the response
    } catch (error) {
        console.error('Error fetching compte:', error);
        throw error; // Propagate the error
    }
};


const updateCompte = async (numeroCompte, compte) => {
    try {
        const response = await axios.put(`${API_URL}/comptes/${numeroCompte}`, compte);
        return response.data; // Return the data part of the response
    } catch (error) {
        console.error('Error updating compte:', error);
        throw error; // Propagate the error
    }
};

const deleteCompte = (numeroCompte) => {
    return axios.delete(`${API_URL}/comptes/${numeroCompte}`);
};

export { createCompte, getComptes, getCompte, updateCompte, deleteCompte,getClientsByCins };
