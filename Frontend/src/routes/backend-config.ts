const API_URL: string = 'http://localhost:';

const CREDIT_PORT: string = '2222';
const OCR_PORT: string = '3333';
const CLIENT_PORT: string = '4444';
const COMPTE_PORT: string = '5555';
const USER_PORT: string = '6666';

export const apiRoutes = {
    // Clients routes
    LIST_CLIENT_URL: `${API_URL}${CLIENT_PORT}/clients`,
    ADD_CLIENT_URL: `${API_URL}${CLIENT_PORT}/clients`,
    EDIT_CLIENT_URL: `${API_URL}${CLIENT_PORT}/clients/`, // Add client ID dynamically
    DELETE_CLIENT_URL: `${API_URL}${CLIENT_PORT}/clients/`, // Add client ID dynamically

    // Compte routes
    LIST_COMPTE_URL: `${API_URL}${COMPTE_PORT}/comptes`,
    ADD_COMPTE_URL: `${API_URL}${COMPTE_PORT}/comptes`,
    EDIT_COMPTE_URL: `${API_URL}${COMPTE_PORT}/comptes/`, // Add compte ID dynamically
    DELETE_COMPTE_URL: `${API_URL}${COMPTE_PORT}/comptes/`, // Add compte ID dynamically
    GET_COMPTE_BY_ID_URL: `${API_URL}${COMPTE_PORT}/comptes/`, // Add compte ID dynamically

    // Credit routes
    LIST_CREDITS_URL: `${API_URL}${CREDIT_PORT}/credits`,
    ADD_CREDIT_URL: `${API_URL}${CREDIT_PORT}/credits`,
    EDIT_CREDIT_URL: `${API_URL}${CREDIT_PORT}/credits/`, // Add credit ID dynamically
    DELETE_CREDIT_URL: `${API_URL}${CREDIT_PORT}/credits/`, // Add credit ID dynamically
    GET_CREDIT_BY_ID_URL: `${API_URL}${CREDIT_PORT}/credits/`, // Add credit ID dynamically

    // OCR routes
    LIST_OCR_URL: `${API_URL}${OCR_PORT}/ocrs`,
    ADD_OCR_URL: `${API_URL}${OCR_PORT}/ocrs`, // Typically OCRs may not need "add" explicitly
    GET_OCR_BY_ID_URL: `${API_URL}${OCR_PORT}/ocrs/`, // Add OCR ID dynamically
    ANALYZE_OCR_URL: `${API_URL}${OCR_PORT}/ocrs/analyze`, // For analyze endpoint
    PERFORM_OCR_URL: `${API_URL}${OCR_PORT}/ocrs/perform`, // For perform OCR endpoint
    DELETE_OCR_URL: `${API_URL}${OCR_PORT}/ocrs/`, // Add OCR ID dynamically

    // User routes
    LIST_USERS_URL: `${API_URL}${USER_PORT}/users`,
    ADD_USER_URL: `${API_URL}${USER_PORT}/users`,
    EDIT_USER_URL: `${API_URL}${USER_PORT}/users/`, // Add user ID dynamically
    DELETE_USER_URL: `${API_URL}${USER_PORT}/users/`, // Add user ID dynamically
    GET_USER_BY_ID_URL: `${API_URL}${USER_PORT}/users/`, // Add user ID dynamically
};