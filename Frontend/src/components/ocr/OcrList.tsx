import React, { useEffect, useState } from 'react';
import {Table, Button, Modal, Upload, message, Empty, Typography, Popconfirm} from 'antd';
import {FileSearchOutlined, QuestionCircleOutlined, UploadOutlined} from '@ant-design/icons';
import {
    getAllOcrEntities,
    deleteOcrById,
    analyzeAndSaveImage,
} from '../../services/ocrService';
import {PageHeader} from "@ant-design/pro-layout";

// Define the OcrEntity interface
interface OcrEntity {
    id: string;
    documentType: string;
    text: string;
    createdAt: string;
}

const OcrList: React.FC = () => {
    const [ocrEntities, setOcrEntities] = useState<OcrEntity[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploadModalVisible, setUploadModalVisible] = useState(false);
    const [fileList, setFileList] = useState<any[]>([]);

    // Fetch all OCR entities
    const fetchOcrEntities = async () => {
        setLoading(true);
        try {
            const data: any[] = await getAllOcrEntities();
            const transformedData: OcrEntity[] = data.map((dto) => ({
                id: dto.id || 'Unknown ID',
                documentType: dto.documentType || 'Unknown Type',
                text: dto.text || 'No Text Available',
                createdAt: dto.createdAt || new Date().toISOString(),
            }));
            setOcrEntities(transformedData);
        } catch (error) {
            message.error('Failed to fetch OCR entities.');
        } finally {
            setLoading(false);
        }
    };

    // Delete an OCR entity
    const handleDelete = async (id: string) => {
        try {
            await deleteOcrById(id);
            message.success('OCR entity deleted successfully.');
            fetchOcrEntities(); // Refresh list
        } catch (error) {
            message.error('Failed to delete OCR entity.');
        }
    };

    // Handle file upload
    const handleUpload = async () => {
        if (fileList.length == 0) {
            message.warning('Please select a file to upload.');
            return;
        }

        try {
            const file = fileList[0];
            const typeDocument = 'defaultType'; // Change this as needed
            await analyzeAndSaveImage(file, typeDocument);
            message.success('File uploaded and analyzed successfully.');
            fetchOcrEntities(); // Refresh list
            setUploadModalVisible(false);
            setFileList([]);
        } catch (error) {
            message.error('Failed to upload and analyze file.');
        }
    };

    // Table columns
    const columns = [
        {
            title: 'Document Type',
            dataIndex: 'documentType',
            key: 'documentType',
            sorter: (a: OcrEntity, b: OcrEntity) =>
                a.documentType.localeCompare(b.documentType),
        },
        {
            title: 'Text',
            dataIndex: 'text',
            key: 'text',
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a: OcrEntity, b: OcrEntity) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_: any, record: OcrEntity) => (
                <Popconfirm
                    title={'Sure to delete ?'}
                    icon={<QuestionCircleOutlined />}
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Typography.Link className="delete-btn">
                        Delete
                    </Typography.Link>
                </Popconfirm>
            ),
        },
    ];

    // Effect hook to fetch data on component mount
    useEffect(() => {
        fetchOcrEntities();
    }, []);

    return (
        <div style={{ padding: '24px' }}>
            <PageHeader
                title={'OCR'}
                extra={[
                    <Button size="large" icon={<FileSearchOutlined />} onClick={() => setUploadModalVisible(true)}>
                        Process Ocr
                    </Button>,
                ]}
            />
            <Table
                dataSource={ocrEntities}
                columns={columns}
                rowKey="id"
                loading={loading}
                bordered
                locale={{
                    emptyText: <Empty description="No OCR Records Found" />,
                }}
            />
            <Modal
                title="Upload and Analyze File"
                visible={uploadModalVisible}
                onOk={handleUpload}
                onCancel={() => setUploadModalVisible(false)}
                okText="Upload"
                cancelText="Cancel"
            >
                <Upload
                    beforeUpload={(file) => {
                        setFileList([file]);
                        return false; // Prevent auto-upload
                    }}
                    fileList={fileList}
                    onRemove={() => setFileList([])}
                >
                    <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
            </Modal>
        </div>
    );
};

export default OcrList;