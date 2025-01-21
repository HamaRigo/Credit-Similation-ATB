import React, { useEffect, useState } from 'react';
import { getOcrById, updateOcrById, deleteOcrById } from '../../services/ocrService';
import { TextField, Button, Typography } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const OcrDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Updated hook
    const [ocr, setOcr] = useState(null);

    useEffect(() => {
        fetchOcr();
    }, [id]);

    const fetchOcr = async () => {
        try {
            const data = await getOcrById(id);
            setOcr(data);
        } catch (error) {
            console.error('Failed to fetch OCR:', error);
        }
    };

    const handleUpdate = async () => {
        try {
            await updateOcrById(id, ocr);
            navigate('/ocrs'); // Updated navigation method
        } catch (error) {
            console.error('Failed to update OCR:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteOcrById(id);
            navigate('/ocrs'); // Updated navigation method
        } catch (error) {
            console.error('Failed to delete OCR:', error);
        }
    };

    return (
        <div>
            {ocr ? (
                <>
                    <Typography variant="h6">OCR Details</Typography>
                    <TextField
                        label="Type of Document"
                        value={ocr.typeDocument}
                        onChange={(e) => setOcr({ ...ocr, typeDocument: e.target.value })}
                    />
                    <TextField
                        label="Results"
                        value={ocr.resultatsReconnaissance}
                        onChange={(e) => setOcr({ ...ocr, resultatsReconnaissance: e.target.value })}
                    />
                    <TextField
                        label="Fraud Status"
                        value={ocr.fraude ? 'Fraudulent' : 'Not Fraudulent'}
                        onChange={(e) => setOcr({ ...ocr, fraude: e.target.value })}
                    />
                    <Button onClick={handleUpdate}>Update</Button>
                    <Button onClick={handleDelete}>Delete</Button>
                </>
            ) : (
                <Typography>Loading...</Typography>
            )}
        </div>
    );
};

export default OcrDetail;
