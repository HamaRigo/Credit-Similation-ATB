import React, { useState } from 'react';
import { performOcr, analyzeAndSaveImage } from '../../services/ocrService';
import { TextField, Button, Typography } from '@mui/material';

const OcrUpload = () => {
    const [file, setFile] = useState(null);
    const [typeDocument, setTypeDocument] = useState('');
    const [numeroCompteId, setNumeroCompteId] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!file) return;

        try {
            const response = await analyzeAndSaveImage(file, typeDocument, numeroCompteId);
            console.log('OCR result:', response);
        } catch (error) {
            console.error('Failed to process OCR:', error);
        }
    };

    return (
        <div>
            <Typography variant="h6">Upload Document for OCR</Typography>
            <input type="file" onChange={handleFileChange} />
            <TextField
                label="Type of Document"
                value={typeDocument}
                onChange={(e) => setTypeDocument(e.target.value)}
            />
            <TextField
                label="Account ID"
                value={numeroCompteId}
                onChange={(e) => setNumeroCompteId(e.target.value)}
            />
            <Button onClick={handleSubmit}>Submit</Button>
        </div>
    );
};

export default OcrUpload;
