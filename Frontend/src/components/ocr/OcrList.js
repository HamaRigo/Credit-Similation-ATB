import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { getAllOcrEntities, analyzeAndSaveImage, deleteOcrById, updateOcrById } from '../../services/ocrService';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

const OcrList = () => {
    const [ocrList, setOcrList] = useState([]);
    const [file, setFile] = useState(null);
    const [typeDocument, setTypeDocument] = useState('');
    const [numeroCompteId, setNumeroCompteId] = useState('');
    const [editOcrId, setEditOcrId] = useState(null);
    const [editField, setEditField] = useState(null);

    const fetchOcrEntities = useCallback(async () => {
        try {
            const response = await getAllOcrEntities();
            console.log('API Response:', response); // Log the entire response

            // Adjust based on the actual response format
            const ocrData = response?.data || response || [];
            setOcrList(Array.isArray(ocrData) ? ocrData : []);
        } catch (error) {
            console.error('Error fetching OCR entities:', error); // Log the error
            toast.error('Error fetching OCR entities.');
        }
    }, []);

    useEffect(() => {
        fetchOcrEntities();
    }, [fetchOcrEntities]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
    };

    const handleAnalyzeAndSave = async () => {
        if (!file) {
            toast.error('Please select a file.');
            return;
        }
        if (!typeDocument || !numeroCompteId) {
            toast.error('Please provide both document type and account number.');
            return;
        }
        try {
            const ocrEntity = await analyzeAndSaveImage(file, typeDocument, numeroCompteId);
            setOcrList([...ocrList, ocrEntity.data]);
            toast.success('Document analyzed and OCR entity saved.');
            setFile(null);
            setTypeDocument('');
            setNumeroCompteId('');
        } catch (error) {
            toast.error('Failed to analyze and save document.');
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteOcrById(id);
            setOcrList(ocrList.filter(ocr => ocr.id !== id));
            toast.success('OCR entity deleted.');
        } catch (error) {
            toast.error('Error deleting OCR entity.');
        }
    };

    const handleInputChange = (id, field, value) => {
        setOcrList(ocrList.map(ocr =>
            ocr.id === id ? { ...ocr, [field]: value } : ocr
        ));
    };

    const handleCellClick = (id, field) => {
        if (editOcrId === id && editField === field) {
            setEditOcrId(null);
            setEditField(null);
        } else {
            setEditOcrId(id);
            setEditField(field);
        }
    };

    const handleSave = async () => {
        const ocrToUpdate = ocrList.find(ocr => ocr.id === editOcrId);
        if (!ocrToUpdate) return;
        try {
            await updateOcrById(editOcrId, ocrToUpdate);
            setEditOcrId(null);
            setEditField(null);
            toast.success('OCR entity updated.');
        } catch (error) {
            toast.error('Failed to update OCR entity.');
        }
    };

    return (
        <div className="ocr-list-container">
            <Typography variant="h6">OCR List</Typography>
            <div className="file-input-section">
                <input type="file" onChange={handleFileChange} />
                <input
                    type="text"
                    placeholder="Document Type"
                    value={typeDocument}
                    onChange={(e) => setTypeDocument(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Account Number ID"
                    value={numeroCompteId}
                    onChange={(e) => setNumeroCompteId(e.target.value)}
                />
                <Button variant="contained" color="primary" onClick={handleAnalyzeAndSave}>
                    Analyze and Save
                </Button>
            </div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Type Document</TableCell>
                            <TableCell>Results</TableCell>

                            <TableCell>Account Number</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Fraud</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ocrList.length > 0 ? (
                            ocrList.map((ocr) => (
                                <TableRow key={ocr.id}>
                                    <TableCell>{ocr.id}</TableCell>
                                    <TableCell onClick={() => handleCellClick(ocr.id, 'typeDocument')}>
                                        {editOcrId === ocr.id && editField === 'typeDocument' ? (
                                            <input
                                                type="text"
                                                value={ocr.typeDocument}
                                                onChange={(e) => handleInputChange(ocr.id, 'typeDocument', e.target.value)}
                                                onBlur={handleSave}
                                                autoFocus
                                            />
                                        ) : (
                                            ocr.typeDocument
                                        )}
                                    </TableCell>
                                    <TableCell>{ocr.resultatsReconnaissance}</TableCell>

                                    <TableCell>{ocr.numeroCompteId}</TableCell>
                                    <TableCell>
                                        {ocr.image && (
                                            <img src={`data:image/png;base64,${ocr.image}`} alt="OCR" width="100" />
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {ocr.fraude ? (
                                            <Button variant="contained" color="error" startIcon={<CancelIcon />}>
                                                Fraud
                                            </Button>
                                        ) : (
                                            <Button variant="contained" color="success" startIcon={<CheckCircleIcon />}>
                                                Not Fraud
                                            </Button>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDelete(ocr.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                        {editOcrId === ocr.id ? (
                                            <IconButton onClick={handleSave}>
                                                <SaveIcon />
                                            </IconButton>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7}>No OCR entities found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default OcrList;
