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

//
// const API_URL: string = process.env.REACT_APP_API_URL || 'http://localhost:';
//
// const CREDIT_PORT: string = process.env.REACT_APP_CREDIT_PORT || '2222';
// const OCR_PORT: string = process.env.REACT_APP_OCR_PORT || '3333';
// const CLIENT_PORT: string = process.env.REACT_APP_CLIENT_PORT || '4444';
// const COMPTE_PORT: string = process.env.REACT_APP_COMPTE_PORT || '5555';
// const USER_PORT: string = process.env.REACT_APP_USER_PORT || '6666';
//
// const CLIENT_BASE_URL = `${API_URL}${CLIENT_PORT}/clients`;
// const COMPTE_BASE_URL = `${API_URL}${COMPTE_PORT}/comptes`;
// const CREDIT_BASE_URL = `${API_URL}${CREDIT_PORT}/credits`;
// const OCR_BASE_URL = `${API_URL}${OCR_PORT}/ocrs`;
// const USER_BASE_URL = `${API_URL}${USER_PORT}/users`;
//
// export const apiRoutes = {
//     // Client endpoints
//     LIST_CLIENT_URL: CLIENT_BASE_URL,
//     ADD_CLIENT_URL: CLIENT_BASE_URL,
//     EDIT_CLIENT_URL: CLIENT_BASE_URL, // Add client ID dynamically
//     DELETE_CLIENT_URL: CLIENT_BASE_URL, // Add client ID dynamically
//
//     // Compte endpoints
//     LIST_COMPTE_URL: COMPTE_BASE_URL,
//     ADD_COMPTE_URL: COMPTE_BASE_URL,
//     EDIT_COMPTE_URL: COMPTE_BASE_URL, // Add compte ID dynamically
//     DELETE_COMPTE_URL: COMPTE_BASE_URL, // Add compte ID dynamically
//
//     // Credit endpoints
//     LIST_CREDITS_URL: CREDIT_BASE_URL,
//     ADD_CREDIT_URL: CREDIT_BASE_URL,
//     EDIT_CREDIT_URL: CREDIT_BASE_URL, // Add credit ID dynamically
//     DELETE_CREDIT_URL: CREDIT_BASE_URL, // Add credit ID dynamically
//
//     // OCR endpoints
//     LIST_OCR_URL: OCR_BASE_URL,
//     ADD_OCR_URL: OCR_BASE_URL, // Add OCR dynamically
//     GET_OCR_BY_ID_URL: `${OCR_BASE_URL}/`, // Add OCR ID dynamically
//     ANALYZE_OCR_URL: `${OCR_BASE_URL}/analyze`,
//     PERFORM_OCR_URL: `${OCR_BASE_URL}/perform`,
//     DELETE_OCR_URL: `${OCR_BASE_URL}/`, // Add OCR ID dynamically
//
//     // User endpoints
//     LIST_USERS_URL: USER_BASE_URL,
//     ADD_USER_URL: USER_BASE_URL,
//     EDIT_USER_URL: USER_BASE_URL, // Add user ID dynamically
//     DELETE_USER_URL: USER_BASE_URL, // Add user ID dynamically
//     GET_USER_BY_ID_URL: `${USER_BASE_URL}/`, // Add user ID dynamically
// };
//
// // Utility for building URLs dynamically
// export const buildUrl = (baseUrl: string, id: string | number): string =>
//     `${baseUrl}/${id}`;