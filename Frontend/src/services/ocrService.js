import axios from 'axios';

const API_BASE_URL = "http://localhost:3333/ocrs";

// Centralized error handling
const handleRequest = async (request) => {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error; // Rethrow or handle the error appropriately
    }
};

// Function to fetch OCR by ID
const getOcrById = (id) => handleRequest(axios.get(`${API_BASE_URL}/${id}`));

// Function to fetch all OCR entities
const getAllOcrEntities = () => handleRequest(axios.get(API_BASE_URL));

// Function to perform OCR on an image
const performOcr = (file) => {
    let formData = new FormData();
    formData.append('file', file);

    return handleRequest(axios.post(`${API_BASE_URL}/perform`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }));
};

// Function to analyze and save an image
const analyzeAndSaveImage = (file, typeDocument, numeroCompteId) => {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('typeDocument', typeDocument);
    formData.append('numeroCompteId', numeroCompteId);

    return handleRequest(axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }));
};

// Function to delete OCR by ID
const deleteOcrById = (id) => handleRequest(axios.delete(`${API_BASE_URL}/${id}`));

// Function to update OCR by ID
const updateOcrById = (id, ocrData) => handleRequest(axios.put(`${API_BASE_URL}/${id}`, ocrData));

export {
    getOcrById,
    getAllOcrEntities,
    performOcr,
    analyzeAndSaveImage,
    deleteOcrById,
    updateOcrById
};
