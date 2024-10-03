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

// Function to upload an image for OCR
// Function to analyze and save an image
const analyzeAndSaveImage = (file, typeDocument = "defaultType", numeroCompteId = null) => {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('typeDocument', typeDocument);

    if (numeroCompteId) {
        formData.append('numeroCompteId', numeroCompteId);
    }

    return handleRequest(axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })).catch((error) => {
        console.error('Error analyzing and saving image:', error);
        throw new Error('Could not analyze and save image. Please try again.');
    });
};

// Function to delete OCR by ID
const deleteOcrById = (id) => handleRequest(axios.delete(`${API_BASE_URL}/${id}`));

// Function to update OCR by ID
const updateOcrById = (id, newText, documentType) => {
    let data = { newText, documentType };
    return handleRequest(axios.put(`${API_BASE_URL}/${id}`, data)).catch((error) => {
        console.error('Error updating OCR:', error);
        throw new Error('Could not update OCR record. Please try again.');
    });
};

export {
    getOcrById,
    getAllOcrEntities,
    analyzeAndSaveImage,
    deleteOcrById,
    updateOcrById
};
