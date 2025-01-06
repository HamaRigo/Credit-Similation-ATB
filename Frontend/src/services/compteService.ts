import axios, { AxiosResponse } from 'axios';

// Define the API URL
const API_URL = 'http://localhost:5555'; // Replace with your Spring Boot server URL

// Define the types for your data models
export interface Client {
  cin: string;
  nom: string;
  prenom: string;
  adresse: string;
  numeroTelephone: string;
}

export interface Compte {
  numeroCompte: string;
  balance: number;
  clientCin: string; // Assuming this links the compte to a client by CIN
  [key: string]: any; // Add additional fields as needed
}

// Function to fetch clients by CINs
const getClientsByCins = async (cins: string[]): Promise<AxiosResponse<Client[]>> => {
  return axios.post<Client[]>(`${API_URL}/clients/byCins`, cins);
};

// Function to fetch all comptes
const getComptes = (): Promise<AxiosResponse<Compte[]>> => {
  return axios.get<Compte[]>(`${API_URL}/comptes`);
};

// Function to create a new compte
const createCompte = (compte: Compte): Promise<AxiosResponse<Compte>> => {
  return axios.post<Compte>(`${API_URL}/comptes`, compte);
};

// Function to fetch a specific compte by numeroCompte
const getCompte = async (numeroCompte: string): Promise<Compte> => {
    try {
    const response = await axios.get<Compte>(`${API_URL}/comptes/${numeroCompte}`);
        return response.data; // Return the data part of the response
    } catch (error) {
        console.error('Error fetching compte:', error);
        throw error; // Propagate the error
    }
};

// Function to update a specific compte
const updateCompte = async (numeroCompte: string, compte: Partial<Compte>): Promise<Compte> => {
    try {
    const response = await axios.put<Compte>(`${API_URL}/comptes/${numeroCompte}`, compte);
        return response.data; // Return the data part of the response
    } catch (error) {
        console.error('Error updating compte:', error);
        throw error; // Propagate the error
    }
};

// Function to delete a specific compte
const deleteCompte = (numeroCompte: string): Promise<void> => {
    return axios.delete(`${API_URL}/comptes/${numeroCompte}`);
};

// Exporting functions
export {
  createCompte,
  getComptes,
  getCompte,
  updateCompte,
  deleteCompte,
  getClientsByCins, // Ensure this is used where necessary
};