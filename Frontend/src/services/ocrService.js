import axios from 'axios';
const API_BASE_URL = "http://localhost:3333/";

// Centralized error handling function
const handleRequest = async (request) => {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        console.error('API request failed:', error);
        throw new Error(error?.response?.data?.message || 'An error occurred');
    }
};

// Reusable function to create FormData
const createFormData = (file, additionalData = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    for (const [key, value] of Object.entries(additionalData)) {
        formData.append(key, value);
    }
    return formData;
};

// Fetch all OCR entries
const getAllOcrEntities = () => handleRequest(axios.get(`${API_BASE_URL}all`));

// Fetch OCR by ID
const getOcrById = (id) => handleRequest(axios.get(`${API_BASE_URL}/${id}`));

// Update OCR by ID
const updateOcrById = (id, newText, documentType) => {
    const data = { newText, documentType };
    return handleRequest(axios.put(`${API_BASE_URL}/${id}`, data, {
        headers: { 'Content-Type': 'application/json' }
    }));
};

// Delete OCR by ID
const deleteOcrById = (id) => handleRequest(axios.delete(`${API_BASE_URL}/${id}`));

// Upload and analyze an image
const analyzeAndSaveImage = (file, typeDocument = "defaultType", numeroCompteId = null) => {
    const formData = createFormData(file, { typeDocument, numeroCompteId });
    return handleRequest(axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }));
};

// Upload image and preview OCR result (Base64 image)
const uploadImageAndPreview = (file, typeDocument = "defaultType") => {
    const formData = createFormData(file, { typeDocument });
    return handleRequest(axios.post(`${API_BASE_URL}/upload-preview`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }));
};

// Generate signature from a file
const generateSignature = (file) => {
    const formData = createFormData(file);
    return handleRequest(axios.post(`${API_BASE_URL}/signature`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }));
};

export {
    getAllOcrEntities,
    getOcrById,
    updateOcrById,
    deleteOcrById,
    analyzeAndSaveImage,
    uploadImageAndPreview,
    generateSignature
};
