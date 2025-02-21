import React, {useState} from "react";
import {
    Modal,
    Form,
    Button,
    Alert, Upload, UploadProps, GetProp, message
} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import { Image } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const ClientSignatureUploadModal = ({
                           modalForm,
                           isModalOpen,
                           onSave,
                           onCancel,
                           errorsModal,
                           previewImage,
                           setPreviewImage,
                           fileList,
                           setFileList,
                       }) => {
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const handlePreview = async () => {
        setPreviewOpen(true);
    };
    const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
        const isDone = checkFileFormatAndSize(newFileList[0] as FileType);
        if (isDone) {
            newFileList[0].error = null;
            newFileList[0].status = 'done';
        }
        setFileList(newFileList);
    }
    const beforeUpload = (file: FileType) => {
        return checkFileFormatAndSize(file) || Upload.LIST_IGNORE;
    };

    const checkFileFormatAndSize = (file: FileType) => {
        if (!file) {
            return false;
        }
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt3M = file.size / 1024 / 1024 < 3;
        if (!isLt3M) {
            message.error('Image must smaller than 3MB!');
        }
        return isJpgOrPng && isLt3M;
    }

    return (
        <Modal
            title={"Client Signature"}
            open={isModalOpen}
            onOk={onSave}
            onCancel={onCancel}
            centered
            footer={null}
            maskClosable={true}
        >
            <Form
                form={modalForm}
                layout="horizontal"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onSave}
                validateTrigger="onSubmit"
            >
                <div style={{margin: '25px 0'}}>
                    {errorsModal != '' && (
                        <Alert
                            type="error"
                            className="alert-msg"
                            message={errorsModal}
                            showIcon
                            style={{marginBottom: '20px'}}
                        />
                    )}
                    <Upload
                        listType="picture-card"
                        maxCount={1}
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        style={{width: 500}}
                        beforeUpload={beforeUpload}
                    >
                        <button style={{border: 0, background: 'none'}} type="button">
                            <PlusOutlined />
                            <div style={{marginTop: 8}}>Upload</div>
                        </button>
                    </Upload>
                    {previewImage && (
                        <Image
                            wrapperStyle={{display: 'none'}}
                            preview={{
                                visible: previewOpen,
                                onVisibleChange: (visible) => setPreviewOpen(visible),
                                afterOpenChange: (visible) => !visible && setPreviewImage(''),
                            }}
                            src={previewImage}
                        />
                    )}
                    <div className="ant-modal-footer">
                        <Button type="default" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Confirm
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default ClientSignatureUploadModal;
