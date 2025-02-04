import React, { useEffect, useState } from 'react';
import {
    Button,
    Modal,
    message,
    Steps,
    Result,
    Upload,
    UploadProps, Select, Form
} from 'antd';
import {
    FileSearchOutlined,
    CheckCircleOutlined,
    FileProtectOutlined,
    FileAddOutlined,
    InboxOutlined
} from "@ant-design/icons";

import {PageHeader} from "@ant-design/pro-layout";
import {OcrType} from "../../types/OcrType";
import {CompteType} from "../../types/CompteType";
import OcrService from "../../services/OcrService";
import CompteService from "../../services/CompteService";
import OcrList from "./OcrList";
import ErrorResult from "../shared/ErrorResult";
import {TypeOcrEnum} from "../../types/TypeOcrEnum";

const contentStyle: React.CSSProperties = {
    lineHeight: '200px',
    textAlign: 'center',
    margin: '40px 0',
};

const documentTypes = Object.values(TypeOcrEnum);

const Ocrs = () => {
    const [data, setData] = useState<OcrType[]>(null);
    const [comptes, setComptes] = useState<CompteType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const props: UploadProps = {
        name: 'file',
        maxCount: 1,
        //listType: "picture",
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    const [currentStep, setCurrentStep] = useState<number>(0);
    const steps = [
        {
            title: 'Step 1',
            description: 'Upload Document',
            icon: <FileAddOutlined/>,
            content: (
                <Form layout="horizontal">
                    <Form.Item name="compte" rules={[{required: true, message: 'Please enter input value'}]}>
                        <Select showSearch allowClear placeholder="Select an account">
                            {comptes?.map(item => <Select.Option value={item.id}>{item.numeroCompte}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="typeDocument" rules={[{required: true, message: 'Please enter input value'}]}>
                        <Select allowClear placeholder="Select the type">
                            {documentTypes?.map(item => <Select.Option value={item}>{item}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item name="image">
                        <Upload.Dragger {...props} style={{padding: '30px 0'}}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag document to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single upload in PNG, JPEG, JPG, PDF format.
                            </p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form>
            ),
        },
        {
            title: 'Step 2',
            description: 'Perform OCR',
            icon: <FileSearchOutlined/>,
            content: <Result status="warning" title="Order number: please wait."  />,
        },
        {
            title: 'Step 3',
            description: 'Fraud Detection',
            icon: <FileProtectOutlined/>,
            content: <Result status="error" title="Order number: please wait." />,
        },
        {
            title: 'Step 4',
            description: 'Results',
            icon: <CheckCircleOutlined/>,
            content: <Result status="success" title="Order number" />,
        },
    ];
    const items = steps.map((item) => (
        { key: item.title, title: item.title, description: item.description, icon: item.icon }
    ));

    const getComptes = () => {
        CompteService.list_comptes()
            .then((response) => {
                if (response.data) {
                    const data :CompteType[] = response.data?.map((item: CompteType) => (
                        { ...item, client: item.client.id }
                    ));
                    setComptes(data);
                }
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const getOcrs = () => {
        OcrService.list_ocrs()
            .then((response) => {
                if (response.data) {
                    setData(response.data);
                }
            })
            .catch((error) => {
                setError(error);
            })
    };

    // Steps actions
    const next = () => {
        setCurrentStep(currentStep + 1);
    };
    const prev = () => {
        setCurrentStep(currentStep - 1);
    };
    const cancelUpload = () => {
        setIsModalOpen(false);
    }

    // Effect hook to fetch data on component mount
    useEffect(() => {
        getOcrs();
        getComptes();
    }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }

    return (
        <>
            <PageHeader
                title={'OCR'}
                extra={[
                    <Button size="large" icon={<FileSearchOutlined />} onClick={() => setIsModalOpen(true)}>
                        Process Ocr
                    </Button>,
                ]}
            />
            <Modal
                title="Process OCR"
                open={isModalOpen}
                onCancel={cancelUpload}
                width={900}
                centered
                footer={null}
                maskClosable={true}
            >
                <div style={{margin: '25px 0'}}>
                    <Steps current={currentStep} items={items} size={'small'} />
                    <div style={contentStyle}>{steps[currentStep].content}</div>
                    <div style={{ textAlign: 'center' }}>
                        {currentStep > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                Previous Step
                            </Button>
                        )}
                        {currentStep < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Next Step
                            </Button>
                        )}
                        {currentStep === steps.length - 1 && (
                            <Button type="primary" onClick={() => {
                                message.success('Processing complete!')
                                cancelUpload()
                            }}>
                                Done
                            </Button>
                        )}
                    </div>
                </div>
            </Modal>

            <OcrList
                data={data}
                setData={setData}
                loading={loading}
                setLoading={setLoading}
                documentTypes={documentTypes}
            />
        </>
    );
}
export default Ocrs;
