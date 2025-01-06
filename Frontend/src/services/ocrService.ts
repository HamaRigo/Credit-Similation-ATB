import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = "http://localhost:3333/ocrs";

// Define interfaces for OCR data models
export interface Ocr {
  id: string; // Adjust type based on your backend
  typeDocument: string;
  numeroCompteId: string;
  fileUrl: string;
  [key: string]: any; // Additional fields
}

// Centralized error handling
const handleRequest = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        console.error('API request failed:', error);
        throw error; // Rethrow or handle the error appropriately
    }
};

// Function to fetch OCR by ID
const getOcrById = (id: string): Promise<Ocr> =>
  handleRequest<Ocr>(axios.get(`${API_BASE_URL}/${id}`));

// Function to fetch all OCR entities
const getAllOcrEntities = (): Promise<Ocr[]> =>
  handleRequest<Ocr[]>(axios.get(API_BASE_URL));

// Function to perform OCR on an image
const performOcr = (file: File): Promise<string> => {
  const formData = new FormData();
    formData.append('file', file);

  return handleRequest<string>(
    axios.post(`${API_BASE_URL}/perform`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
};

// Function to analyze and save an image
const analyzeAndSaveImage = (
  file: File,
  typeDocument: string,
  numeroCompteId: string
): Promise<Ocr> => {
  const formData = new FormData();
    formData.append('file', file);
    formData.append('typeDocument', typeDocument);
    formData.append('numeroCompteId', numeroCompteId);

  return handleRequest<Ocr>(
    axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  );
};

// Function to delete OCR by ID
const deleteOcrById = (id: string): Promise<void> =>
  handleRequest<void>(axios.delete(`${API_BASE_URL}/${id}`));

// Function to update OCR by ID
const updateOcrById = (id: string, ocrData: Partial<Ocr>): Promise<Ocr> =>
  handleRequest<Ocr>(axios.put(`${API_BASE_URL}/${id}`, ocrData));

// Export functions
export {
    getOcrById,
    getAllOcrEntities,
    performOcr,
    analyzeAndSaveImage,
    deleteOcrById,
  updateOcrById,
};