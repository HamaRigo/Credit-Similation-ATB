import React, { useEffect, useState } from 'react';

import {Form, Button} from 'antd';

import ClientService from '../../services/ClientService';
import { ClientType } from "../../types/ClientType";
import {UserAddOutlined} from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import ErrorResult from "../shared/ErrorResult";
import { TypeDocumentEnum } from "../../types/TypeDocumentEnum";
import { PageHeader } from "@ant-design/pro-layout";
import ClientFormModal from "./ClientFormModal";
import ClientList from "./ClientList";

const documentTypes = Object.values(TypeDocumentEnum);

const Clients = () => {
    const [data, setData] = useState<ClientType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalForm] = Form.useForm();
    const [errorsModal, setErrorsModal] = React.useState<string>('');
    const [editingRecord, setEditingRecord] = useState<ClientType>(null);

    // actions
    const getClients = () => {
        setLoading(true);
        ClientService.list_clients()
            .then((response) => {
                /*const result :ClientType[] = response.data?.map((item: ClientType) => (
                    { ...item, key: item.numeroDocument }
                ));*/
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
            <ClientList
                data={data}
                setData={setData}
                loading={loading}
                setLoading={setLoading}
                documentTypes={documentTypes}
                toggleEdit={toggleEdit}
            />
        </>
    );
};

export default Clients;
