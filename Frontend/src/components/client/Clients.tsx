import React, { useEffect, useState } from 'react';

import {Form, Button, UploadFile} from 'antd';

import ClientService from '../../services/ClientService';
import { ClientType } from "../../types/ClientType";
import {UserAddOutlined} from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import ErrorResult from "../shared/ErrorResult";
import { TypeDocumentEnum } from "../../types/TypeDocumentEnum";
import { PageHeader } from "@ant-design/pro-layout";
import ClientFormModal from "./ClientFormModal";
import ClientList from "./ClientList";
import ClientSignatureUploadModal from "./ClientSignatureUploadModal";

const documentTypes = Object.values(TypeDocumentEnum);

const Clients = () => {
    const [data, setData] = useState<ClientType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalForm] = Form.useForm();
    const [errorsModal, setErrorsModal] = React.useState<string>('');

    const [previewImage, setPreviewImage] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile[]>();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadForm] = Form.useForm();
    const [errorsUploadModal, setErrorsUploadModal] = React.useState<string>('');

    const [editingRecord, setEditingRecord] = useState<ClientType>(null);

    // actions
    const getClients = () => {
        setLoading(true);
        ClientService.list_clients()
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const toggleAdd = () => {
        setErrorsModal('')
        setIsModalOpen(true)
    }
    const handleAdd = async (values) => {
        const formValues: ClientType = updateFormValues(values);
        const result = await ClientService.client_exists(formValues.numeroDocument);
        if (result.data) {
            setErrorsModal('Client with this document number already exists')
        } else {
            setErrorsModal('');
            ClientService.add_client(formValues)
                .then((response) => {
                    setLoading(true);
                    setIsModalOpen(false);
                    const newRowData: ClientType = response.data;
                    Notifications.openNotificationWithIcon('success', 'Client added successfully !');
                    //delete data of form
                    modalForm?.resetFields();
                    //add data to table
                    setLoading(false);
                    setData([...data, newRowData]);
                })
                .catch((error) => {
                    setErrorsModal(error.message);
                });
        }
    };
    const cancelAdd = () => {
        modalForm.resetFields();
        setIsModalOpen(false);
    }

    const toggleEdit = (record: ClientType) => {
        setErrorsModal('');
        modalForm.setFieldsValue({ ...record });
        setEditingRecord(record);
        setIsModalOpen(true);
    };
    const cancelEdit = () => {
        modalForm.resetFields();
        setEditingRecord(null);
        setIsModalOpen(false);
    }
    const saveEdit = async (values) => {
        const formValues = updateFormValues(values)
        formValues.id = editingRecord.id
        formValues.signature = editingRecord.signature
        let result
        if (formValues.numeroDocument != editingRecord.numeroDocument) {
            result = await ClientService.client_exists(formValues.numeroDocument);
        }
        if (result?.data) {
            Notifications.openNotificationWithIcon('error', 'Client with this document number already exists')
        } else {
            ClientService.edit_client(formValues)
                .then((response) => {
                    const newRowData: ClientType = response.data;
                    const newData = [...data];
                    const index = newData.findIndex((item) => editingRecord.id == item.id);
                    if (index > -1 && newRowData != undefined) {
                        const item = newData[index];
                        newRowData.compteCount = item.compteCount
                        newRowData.creditCount = item.creditCount
                        newData.splice(index, 1, {
                            ...item,
                            ...newRowData,
                        });
                        setData(newData);
                        cancelEdit();
                    }
                    Notifications.openNotificationWithIcon('success', 'Client updated successfully !');
                })
                .catch((error) => {
                    setErrorsModal(error.message);
                });
        }
    };

    const updateFormValues = (formValues) => {
        formValues.signature = ''
        return formValues;
    }

    const toggleUpload = async (id: number) => {
        setErrorsUploadModal('');
        uploadForm.setFieldsValue({clientId: id});
        await fetchClientSignature(id);
        setIsUploadModalOpen(true);
    };
    const handleUpload = () => {
        const clientId = uploadForm.getFieldValue('clientId');
        const uploadedFile = fileList[0];
        if (clientId) {
            if (uploadedFile) {
                const formData = new FormData();
                formData.append("file", uploadedFile.originFileObj)
                ClientService.upload_signature(clientId, formData)
                    .then((response) => {
                        if (response.data) {
                            Notifications.openNotificationWithIcon('success', 'Client signature uploaded successfully !');
                            cancelUpload();
                        }
                    })
                    .catch((error) => {
                        setErrorsUploadModal(error.message);
                        console.error("Upload error:", error);
                    });
            } else {
                ClientService.delete_signature(clientId)
                    .then((response) => {
                        Notifications.openNotificationWithIcon('success', 'Client signature deleted successfully !');
                        cancelUpload();
                    })
                    .catch((error) => {
                        setErrorsUploadModal(error.message);
                    });
            }
        }
    };
    const cancelUpload = () => {
        uploadForm.resetFields();
        setPreviewImage(null);
        setFileList(null);
        setIsUploadModalOpen(false);
    };
    const fetchClientSignature = (id: number) => {
        ClientService.get_signature(id)
            .then((response) => {
                const imageUrl = URL.createObjectURL(response.data);
                setPreviewImage(imageUrl);
                setFileList([{
                    uid: '-1',
                    name: 'signature.png',
                    status: 'done',
                    url: imageUrl,
                }]);
            })
            .catch((error) => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        //Runs only on the first render
        getClients();
    }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }

    return (
        <>
            <PageHeader
                title={'Clients'}
                extra={[
                    <Button size="large" icon={<UserAddOutlined/>} onClick={toggleAdd}>
                        Add Client
                    </Button>,
                ]}
            />
            <ClientFormModal
                modalForm={modalForm}
                documentTypes={documentTypes}
                isModalOpen={isModalOpen}
                isEditing={editingRecord != null}
                onSave={editingRecord ? saveEdit : handleAdd}
                onCancel={editingRecord ? cancelEdit : cancelAdd}
                errorsModal={errorsModal}
                setErrorsModal={setErrorsModal}
            />
            <ClientSignatureUploadModal
                modalForm={uploadForm}
                isModalOpen={isUploadModalOpen}
                previewImage={previewImage}
                setPreviewImage={setPreviewImage}
                onSave={handleUpload}
                onCancel={cancelUpload}
                errorsModal={errorsUploadModal}
                fileList={fileList}
                setFileList={setFileList}
            />
            <ClientList
                data={data}
                setData={setData}
                loading={loading}
                setLoading={setLoading}
                documentTypes={documentTypes}
                toggleEdit={toggleEdit}
                toggleUpload={toggleUpload}
            />
        </>
    );
};

export default Clients;
