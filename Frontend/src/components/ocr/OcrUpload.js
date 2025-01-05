import React, { useState } from 'react';
import { analyzeAndSaveImage } from '../../services/ocrService'; // Your service for OCR processing
import { TextField, Button, Typography, CircularProgress, Alert, Box } from '@mui/material';

const OcrUpload = () => {
    const [file, setFile] = useState(null);
    const [typeDocument, setTypeDocument] = useState('');
    const [numeroCompteId, setNumeroCompteId] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setTypeDocument('');
        setNumeroCompteId('');

        // Clear messages when a new file is selected
        setErrorMessage('');
        setSuccessMessage('');

        // Validate file type and size
        const maxFileSize = 5 * 1024 * 1024; // 5MB limit
        if (selectedFile && !selectedFile.type.startsWith('image')) {
            setErrorMessage('Please upload a valid image file (e.g., .jpg, .png).');
            setFile(null); // Reset the file input if it's not an image
        } else if (selectedFile && selectedFile.size > maxFileSize) {
            setErrorMessage('The file size exceeds the 5MB limit.');
            setFile(null); // Reset the file input if the size is too large
        }
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
            // Call the OCR service to analyze and save the image
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
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
                Upload Document for OCR
            </Typography>

            {/* File Upload Input */}
            <input
                type="file"
                onChange={handleFileChange}
                disabled={loading}
                style={{ display: 'block', margin: '20px 0' }}
            />

            {/* Document Type Input */}
            <TextField
                label="Type of Document"
                value={typeDocument}
                onChange={(e) => setTypeDocument(e.target.value)}
                disabled={loading}
                fullWidth
                margin="normal"
            />

            {/* Optional Account ID Input */}
            <TextField
                label="Account ID (Optional)"
                value={numeroCompteId}
                onChange={(e) => setNumeroCompteId(e.target.value)}
                disabled={loading}
                fullWidth
                margin="normal"
            />

            {/* Submit Button with loading spinner */}
            <Box display="flex" justifyContent="center" sx={{ marginTop: 2 }}>
                {loading ? (
                    <Button
                        variant="contained"
                        color="primary"
                        disabled
                        sx={{ width: '100%' }}
                    >
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={loading}
                        sx={{ width: '100%' }}
                    >
                        Submit
                    </Button>
                )}
            </Box>

            {/* Success and Error Alerts */}
            {successMessage && <Alert severity="success" sx={{ marginTop: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ marginTop: 2 }}>{errorMessage}</Alert>}
        </Box>
    );
};

export default OcrUpload;
