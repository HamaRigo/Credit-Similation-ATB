import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = "http://localhost:3333/ocrs";

// Define interfaces for Credit and CreditModel
export interface Credit {
  id: string; // Adjust type based on your backend
  amount: number;
  term: number;
  interestRate: number;
  [key: string]: any; // Additional fields
}

export interface CreditModel {
  id: string; // Adjust type based on your backend
  name: string;
  description: string;
  parameters: Record<string, any>; // Replace with specific structure if known
  [key: string]: any; // Additional fields
}

// CRUD operations for Credits

const getCreditById = (id: string): Promise<AxiosResponse<Credit>> => {
  return axios.get<Credit>(`${API_BASE_URL}/${id}`);
};

const getAllCredits = (): Promise<AxiosResponse<Credit[]>> => {
  return axios.get<Credit[]>(API_BASE_URL);
};

const createCredit = (creditData: Credit): Promise<AxiosResponse<Credit>> => {
  return axios.post<Credit>(API_BASE_URL, creditData);
};

const updateCredit = (id: string, creditData: Partial<Credit>): Promise<AxiosResponse<Credit>> => {
  return axios.put<Credit>(`${API_BASE_URL}/${id}`, creditData);
};

const deleteCredit = (id: string): Promise<void> => {
    return axios.delete(`${API_BASE_URL}/${id}`);
};

// CRUD operations for Credit Models

const getCreditModelById = (id: string): Promise<AxiosResponse<CreditModel>> => {
  return axios.get<CreditModel>(`${API_BASE_URL}/models/${id}`);
};

const getAllCreditModels = (): Promise<AxiosResponse<CreditModel[]>> => {
  return axios.get<CreditModel[]>(`${API_BASE_URL}/models`);
};

const createCreditModel = (creditModelData: CreditModel): Promise<AxiosResponse<CreditModel>> => {
  return axios.post<CreditModel>(`${API_BASE_URL}/models`, creditModelData);
};

const updateCreditModel = (id: string, creditModelData: Partial<CreditModel>): Promise<AxiosResponse<CreditModel>> => {
  return axios.put<CreditModel>(`${API_BASE_URL}/models/${id}`, creditModelData);
};

const deleteCreditModel = (id: string): Promise<void> => {
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
    deleteCreditModel,
};