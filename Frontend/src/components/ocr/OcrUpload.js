import React, { useState } from 'react';
import { analyzeAndSaveImage } from '../../services/ocrService';
import { TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';

const OcrUpload = () => {
    const [file, setFile] = useState(null);
    const [typeDocument, setTypeDocument] = useState('');
    const [numeroCompteId, setNumeroCompteId] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setErrorMessage(''); // Clear any previous error
    };

    const handleSubmit = async () => {
        if (!file) {
            setErrorMessage('Please upload a file.');
            return;
        }

        if (!typeDocument) {
            setErrorMessage('Please provide a document type.');
            return;
        }

        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await analyzeAndSaveImage(file, typeDocument, numeroCompteId);
            console.log('OCR result:', response);
            setSuccessMessage('OCR process completed successfully!');
        } catch (error) {
            console.error('Failed to process OCR:', error);
            setErrorMessage('Failed to analyze and save the image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Typography variant="h6">Upload Document for OCR</Typography>
            <input
                type="file"
                onChange={handleFileChange}
                disabled={loading}
            />
            <TextField
                label="Type of Document"
                value={typeDocument}
                onChange={(e) => setTypeDocument(e.target.value)}
                disabled={loading}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Account ID (Optional)"
                value={numeroCompteId}
                onChange={(e) => setNumeroCompteId(e.target.value)}
                disabled={loading}
                fullWidth
                margin="normal"
            />

            {loading ? (
                <CircularProgress style={{ margin: '20px 0' }} />
            ) : (
                <Button variant="contained" color="primary" onClick={handleSubmit} disabled={loading}>
                    Submit
                </Button>
            )}

            {/* Success and error messages */}
            {successMessage && <Alert severity="success">{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" style={{ marginTop: '10px' }}>{errorMessage}</Alert>}
        </div>
    );
};

export default OcrUpload;
