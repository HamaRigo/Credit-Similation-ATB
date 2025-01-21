import React, { useEffect, useState } from 'react';
import { getOcrById } from '../../services/ocrService';
import { useParams } from 'react-router-dom';
import { Card, Spin, message } from 'antd';

const OcrDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the ID from the route parameters
    const [ocrDetail, setOcrDetail] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOcrDetail = async () => {
            setLoading(true);
            try {
                const data = await getOcrById(id as string);
                setOcrDetail(data);
            } catch (error) {
                message.error('Failed to fetch OCR details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOcrDetail();
        }
    }, [id]);

    if (loading) {
        return <Spin tip="Loading OCR details..." />;
    }

    if (!ocrDetail) {
        return <p>OCR details not found.</p>;
    }

    return (
        <Card title="OCR Details" style={{ width: '100%' }}>
            <p><strong>ID:</strong> {ocrDetail.id}</p>
            <p><strong>Document Type:</strong> {ocrDetail.documentType}</p>
            <p><strong>Text:</strong> {ocrDetail.text}</p>
            <p><strong>Created At:</strong> {ocrDetail.createdAt}</p>
        </Card>
    );
};

export default OcrDetail;