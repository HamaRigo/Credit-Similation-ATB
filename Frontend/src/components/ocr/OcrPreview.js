import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadImageAndPreview } from '../../services/ocrService'; // Import the new method
import {
    Box,
    Typography,
    Container,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const OcrPreview = () => {
    const [file, setFile] = useState(null);
    const [typeDocument, setTypeDocument] = useState('');
    const [loading, setLoading] = useState(false);
    const [ocrResult, setOcrResult] = useState(null);
    const [previewError, setPreviewError] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.size > 2 * 1024 * 1024) {
            toast.error('File size should be under 2MB.');
            return;
        }
        if (selectedFile && !['image/png', 'image/jpeg'].includes(selectedFile.type)) {
            toast.error('Only PNG and JPEG files are supported.');
            return;
        }
        setFile(selectedFile);
    };

    const handleAnalyzeAndPreview = async () => {
        if (!file || !typeDocument) {
            toast.error('Please provide file and document type.');
            return;
        }

        setLoading(true);
        try {
            const result = await uploadImageAndPreview(file, typeDocument);
            setOcrResult(result);
        } catch (error) {
            setPreviewError('Error previewing the document. Please try again.');
            toast.error('Failed to preview the OCR document.');
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setPreviewError(null);
    };

    return (
        <Container>
            <Box my={4}>
                <Typography variant="h4" gutterBottom>
                    Upload Document for OCR Preview
                </Typography>

                <Box my={2}>
                    <input
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        style={{ display: 'block', margin: '20px 0' }}
                    />
                </Box>

                <FormControl fullWidth style={{ marginBottom: '10px' }}>
                    <InputLabel>Document Type</InputLabel>
                    <Select
                        value={typeDocument}
                        onChange={(e) => setTypeDocument(e.target.value)}
                        label="Document Type">
                        <MenuItem value="Cheque Bancaire">Cheque Bancaire</MenuItem>
                        <MenuItem value="Effet">Effet</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAnalyzeAndPreview}
                    startIcon={<UploadFileIcon />}
                    disabled={loading}
                    style={{ marginTop: '20px' }}
                >
                    {loading ? <CircularProgress size={24} /> : 'Analyze and Preview'}
                </Button>
            </Box>

            {ocrResult && (
                <Box my={4}>
                    <Typography variant="h5" gutterBottom>
                        OCR Result Preview
                    </Typography>
                    <Box mb={2}>
                        <Typography variant="h6">Document Type: {ocrResult.typeDocument}</Typography>
                        <Typography variant="body1">Account Number: {ocrResult.numeroCompteId}</Typography>
                    </Box>

                    <Box mb={2}>
                        <img
                            src={`data:image/png;base64,${ocrResult.previewImage}`}
                            alt="OCR Preview"
                            style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </Box>

                    <Box mb={2}>
                        <Typography variant="body2">OCR Text: {ocrResult.resultatsReconnaissance}</Typography>
                    </Box>

                    <Box display="flex" justifyContent="center" alignItems="center">
                        {ocrResult.fraude ? (
                            <Button variant="contained" color="error" startIcon={<CancelIcon />}>
                                Fraud Detected
                            </Button>
                        ) : (
                            <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}>
                                No Fraud
                            </Button>
                        )}
                    </Box>
                </Box>
            )}

            {previewError && (
                <Dialog open={true} onClose={handleCloseDialog}>
                    <DialogTitle>Error</DialogTitle>
                    <DialogContent>
                        <DialogContentText>{previewError}</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Container>
    );
};

export default OcrPreview;
