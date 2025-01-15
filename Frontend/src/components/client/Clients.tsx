import React, { useEffect, useState } from 'react';

import {
    TableProps,
    Form,
    Input,
    Popconfirm,
    Table,
    Typography,
    Select,
    Space,
    Tag,
    Button,
    Modal,
    Alert,
} from 'antd';

import ClientService from '../../services/ClientService';
import { ClientType } from "../../types/ClientType";
import { QuestionCircleOutlined, UserAddOutlined } from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import { FormInstance } from "antd/lib/form";
import EditableCell from "../shared/EditableCell";
import ErrorResult from "../shared/ErrorResult";
import { TypeDocumentEnum } from "../../types/TypeDocumentEnum";
import { PageHeader } from "@ant-design/pro-layout";

const documentTypes = Object.values(TypeDocumentEnum);

const Clients = () => {
    const [data, setData] = useState<ClientType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let addForm: FormInstance = null;
    const [errorsAdd, setErrorsAdd] = React.useState<string>('');
    const initialAddValues: ClientType = {
        typeDocument: null,
        numeroDocument: '',
        nom: '',
        prenom: '',
        adresse: '',
        telephone: '',
    };
    const [editForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(null);
    const isEditing = (record: ClientType) => record.id === editingKey;
    const columns = [
        {
            title: 'Type',
            dataIndex: 'typeDocument',
            editable: true,
            inputType: 'select',
            selectValues: documentTypes,
            width: '15%',
            filters: documentTypes.map((item) => (
                { text: item, value: item }
            )),
            onFilter: (value: string, record: ClientType) => record.typeDocument == value,
            render: (_, {typeDocument}) => {
                let color;
                switch (typeDocument) {
                    case TypeDocumentEnum.PERMIS:
                        color = 'geekblue';
                        break;
                    case TypeDocumentEnum.PASSEPORT:
                        color = 'purple';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color} key={typeDocument}>{typeDocument}</Tag>;
            },
        },
        {
            title: 'Document',
            dataIndex: 'numeroDocument',
            editable: true,
            sorter: (a, b) => a.numeroDocument - b.numeroDocument,
        },
        {
            title: 'Firstname',
            dataIndex: 'prenom',
            editable: true,
            sorter: (a, b) => a.prenom.length - b.prenom.length,
        },
        {
            title: 'Lastname',
            dataIndex: 'nom',
            editable: true,
            sorter: (a, b) => a.nom.length - b.nom.length,
        },
        {
            title: 'Address',
            dataIndex: 'adresse',
            editable: true,
            sorter: (a, b) => a.adresse.length - b.adresse.length,
        },
        {
            title: 'Phone',
            dataIndex: 'telephone',
            editable: true,
            inputType: 'phone',
            sorter: (a, b) => a.telephone - b.telephone,
        },
        {
            title: 'Comptes',
            dataIndex: 'compteCount',
            editable: false,
            width: '10%',
            sorter: (a, b) => a.compteCount - b.compteCount,
        },
        {
            title: 'Actions',
            width: '12%',
            render: (_, record: ClientType) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link onClick={() => saveEdit(record)} style={{ marginInlineEnd: 8 }}>
                          Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel ?" onConfirm={cancelEdit}>
                          <a>Cancel</a>
                        </Popconfirm>
                  </span>
                ) : (
                    <Space size="middle">
                        <Typography.Link className="edit-btn" disabled={editingKey !== null} onClick={() => toggleEdit(record)}>
                            Edit
                        </Typography.Link>
                        <Popconfirm
                            title={'Sure to delete ?'}
                            icon={<QuestionCircleOutlined />}
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Typography.Link className="delete-btn">
                                Delete
                            </Typography.Link>
                        </Popconfirm>
                    </Space>
                );
            },
        },
    ];
    const mergedColumns: TableProps<ClientType>['columns'] = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: ClientType) => ({
                record,
                inputType: col.inputType ?? 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                selectValues: col.selectValues ?? null,
            }),
        };
    });

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
        addForm?.resetFields();
        setErrorsAdd('');
        setIsModalOpen(true);
    }
    const handleAdd = async (values) => {
        const formValues: ClientType = values;
        const result = await ClientService.client_exists(formValues.numeroDocument);
        if (result.data) {
            setErrorsAdd('Client with this document number already exists')
        } else {
            setErrorsAdd('');
            ClientService.add_client(formValues)
                .then((response) => {
                    setLoading(true);
                    setIsModalOpen(false);
                    const newRowData: ClientType = response.data;
                    Notifications.openNotificationWithIcon('success', 'Client added successfully !');
                    //delete data of form
                    addForm?.resetFields();
                    //add data to table
                    setLoading(false);
                    setData([...data, newRowData]);
                })
                .catch((error) => {
                    setErrorsAdd(error.message);
                });
        }
    };
    const cancelAdd = () => setIsModalOpen(false);
    const toggleEdit = (record: ClientType) => {
        editForm.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };
    const cancelEdit = () => setEditingKey(null);
    const saveEdit = async (record: ClientType) => {
        try {
            const formValues = await editForm.validateFields();
            formValues.id = record.id
            let result
            if (formValues.numeroDocument != record.numeroDocument) {
                result = await ClientService.client_exists(formValues.numeroDocument);
            }
            if (result?.data) {
                Notifications.openNotificationWithIcon('error', 'Client with this document number already exists')
            } else {
                ClientService.edit_client(formValues)
                    .then((response) => {
                        const newRowData: ClientType = response.data;
                        const newData = [...data];
                        const index = newData.findIndex((item) => record.id === item.id);
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
                        Notifications.openNotificationWithIcon('error', error.message);
                    });
            }
        } catch (errInfo) {
            Notifications.openNotificationWithIcon('error', errInfo.message);
        }
    };
    const handleDelete = (id: number) => {
        setLoading(true);
        ClientService.delete_client(id)
            .then((_) => {
                const newData = [...data];
                // update item
                const index = newData.findIndex((item) => id === item.id);
                if (index > -1) {
                    const updatedData = newData.filter((item) => item.id != id);
                    setLoading(false);
                    setData(updatedData);
                    Notifications.openNotificationWithIcon('success', 'Client deleted successfully !');
                }
            })
            .catch((error) => {
                Notifications.openNotificationWithIcon('error', error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

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
            <Modal
                title="Add Client"
                open={isModalOpen}
                onOk={handleAdd}
                onCancel={cancelAdd}
                centered
                footer={null}
                maskClosable={true}
            >
                <Form
                    layout="horizontal"
                    ref={(form: any) => (addForm = form)}
                    initialValues={initialAddValues}
                    onValuesChange={() => setErrorsAdd('')}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    onFinish={handleAdd}
                    validateTrigger="onSubmit"
                >
                    <div style={{margin: '25px 0'}}>
                        {errorsAdd != '' && (
                            <Alert
                                type="error"
                                className="alert-msg"
                                message={errorsAdd}
                                showIcon
                                style={{marginBottom: '20px'}}
                            />
                        )}
                        <Form.Item
                            label="Document Type"
                            name="typeDocument"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Select>
                                {documentTypes.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Document Number"
                            name="numeroDocument"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Firstname"
                            name="prenom"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Lastname"
                            name="nom"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Address"
                            name="adresse"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Phone"
                            name="telephone"
                            rules={[
                                {required: true, message: 'Please enter input value'},
                                {pattern: /^\d{8}$/, message: 'Phone must be exactly 8 digits!'},
                            ]}
                        >
                            <Input showCount maxLength={8}/>
                        </Form.Item>
                        <div className="ant-modal-footer">
                            <Button type="default" onClick={cancelAdd}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal>
            <Form form={editForm} component={false}>
                <Table
                    loading={loading}
                    columns={mergedColumns}
                    dataSource={data}
                    components={{
                        body: { cell: EditableCell },
                    }}
                    rowClassName="editable-row"
                    pagination={{ onChange: cancelEdit }}
                    showSorterTooltip={{ target: 'sorter-icon' }}
                />
            </Form>
        </>
    );
};

export default Clients;
