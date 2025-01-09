const API_URL: string = 'http://localhost:';

const CREDIT_PORT: string = '2222';
const OCR_PORT: string = '3333';
const CLIENT_URL: string = '4444/clients';
const COMPTE_PORT: string = '5555';
const USER_PORT:string = '6666';

export const apiRoutes = {
    // clients routes
    LIST_CLIENT_URL: API_URL + CLIENT_URL,
    ADD_CLIENT_URL: API_URL + CLIENT_URL,
    EDIT_CLIENT_URL: API_URL + CLIENT_URL,
    DELETE_CLIENT_URL: API_URL + CLIENT_URL,
}