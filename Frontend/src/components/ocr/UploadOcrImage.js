import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { uploadImageForOcr } from '../../services/ocrService';

const UploadOcrImage = () => {
    const [file, setFile] = useState(null);
    const [typeDocument, setTypeDocument] = useState('');
    const [numeroCompteId, setNumeroCompteId] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please select a file.');
            return;
        }

        try {
            const ocrResult = await uploadImageForOcr(file, typeDocument, numeroCompteId);
            toast.success('Image uploaded and processed successfully!');
            console.log('OCR Result:', ocrResult);
            // Handle the OCR result as needed
        } catch (error) {
            toast.error('Failed to upload and process image.');
            console.error(error);
        }
    };

    return (
        <div className="upload-ocr-container">
            <h2>Upload Image for OCR</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="file">Select Image:</label>
                    <input type="file" id="file" onChange={handleFileChange} required />
                </div>
                <div>
                    <label htmlFor="typeDocument">Type Document:</label>
                    <input
                        type="text"
                        id="typeDocument"
                        value={typeDocument}
                        onChange={(e) => setTypeDocument(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="numeroCompteId">Numero Compte ID (optional):</label>
                    <input
                        type="text"
                        id="numeroCompteId"
                        value={numeroCompteId}
                        onChange={(e) => setNumeroCompteId(e.target.value)}
                    />
                </div>
                <button type="submit">Upload and Process</button>
            </form>
        </div>
    );
};

export default UploadOcrImage;
