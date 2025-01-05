import React, { useEffect, useState, useCallback } from 'react';
import { getOcrById, updateOcrById, deleteOcrById } from '../../services/ocrService';
import { TextField, Button, Typography, CircularProgress, Alert, Box } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const OcrDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [ocr, setOcr] = useState(null);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Extracted fetchOcr function
    const fetchOcr = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getOcrById(id);
            setOcr(data);
        } catch (error) {
            console.error('Failed to fetch OCR:', error);
            setErrorMessage('Failed to fetch OCR details. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchOcr();
    }, [fetchOcr]);

    const handleUpdate = async () => {
        if (!ocr.typeDocument || !ocr.resultatsReconnaissance) {
            setErrorMessage('Please fill in all fields before updating.');
            return;
        }

        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await updateOcrById(id, ocr.typeDocument, ocr.resultatsReconnaissance, ocr.fraude);
            setSuccessMessage('OCR updated successfully!');
            navigate('/ocrs');
        } catch (error) {
            console.error('Failed to update OCR:', error);
            setErrorMessage('Failed to update OCR. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            await deleteOcrById(id);
            setSuccessMessage('OCR deleted successfully!');
            navigate('/ocrs');
        } catch (error) {
            console.error('Failed to delete OCR:', error);
            setErrorMessage('Failed to delete OCR. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleFraudStatusChange = (event) => {
        const value = event.target.value === 'Fraudulent' ? true : false;
        setOcr({ ...ocr, fraude: value });
    };

    return (
        <Box sx={{ maxWidth: 600, margin: '0 auto', padding: 4 }}>
            {loading ? (
                <CircularProgress />
            ) : ocr ? (
                <>
                    <Typography variant="h6">OCR Details</Typography>
                    {/* Document Type Input */}
                    <TextField
                        label="Type of Document"
                        value={ocr.typeDocument}
                        onChange={(e) => setOcr({ ...ocr, typeDocument: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    {/* OCR Results Input */}
                    <TextField
                        label="OCR Results"
                        value={ocr.resultatsReconnaissance}
                        onChange={(e) => setOcr({ ...ocr, resultatsReconnaissance: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    {/* Fraud Status Toggle */}
                    <TextField
                        label="Fraud Status"
                        value={ocr.fraude ? 'Fraudulent' : 'Not Fraudulent'}
                        onChange={handleFraudStatusChange}
                        fullWidth
                        margin="normal"
                    />

                    {/* Buttons */}
                    <Box display="flex" justifyContent="space-between" marginTop={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpdate}
                            disabled={loading}
                        >
                            Update
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleDelete}
                            disabled={loading}
                        >
                            Delete
                        </Button>
                    </Box>
                </>
            ) : (
                <Typography>Loading...</Typography>
            )}

            {/* Success and Error Alerts */}
            {successMessage && <Alert severity="success" sx={{ marginTop: 2 }}>{successMessage}</Alert>}
            {errorMessage && <Alert severity="error" sx={{ marginTop: 2 }}>{errorMessage}</Alert>}
        </Box>
    );
};

export default OcrDetail;
