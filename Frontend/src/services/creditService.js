import axios from 'axios';

const API_BASE_URL = "http://localhost:3333/api/credits"; // Adjust the URL as needed

const getCreditById = (id) => {
    return axios.get(`${API_BASE_URL}/${id}`);
};

const getAllCredits = () => {
    return axios.get(API_BASE_URL);
};

const createCredit = (creditData) => {
    return axios.post(API_BASE_URL, creditData);
};

const updateCredit = (id, creditData) => {
    return axios.put(`${API_BASE_URL}/${id}`, creditData);
};

const deleteCredit = (id) => {
    return axios.delete(`${API_BASE_URL}/${id}`);
};

// CRUD operations for CreditModel

const getCreditModelById = (id) => {
    return axios.get(`${API_BASE_URL}/models/${id}`);
};

const getAllCreditModels = () => {
    return axios.get(`${API_BASE_URL}/models`);
};

const createCreditModel = (creditModelData) => {
    return axios.post(`${API_BASE_URL}/models`, creditModelData);
};

const updateCreditModel = (id, creditModelData) => {
    return axios.put(`${API_BASE_URL}/models/${id}`, creditModelData);
};

const deleteCreditModel = (id) => {
    return axios.delete(`${API_BASE_URL}/models/${id}`);
};

export {
    getCreditById,
    getAllCredits,
    createCredit,
    updateCredit,
    deleteCredit,
    getCreditModelById,
    getAllCreditModels,
    createCreditModel,
    updateCreditModel,
    deleteCreditModel
};
