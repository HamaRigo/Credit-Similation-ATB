import React, { useEffect, useState } from 'react';

import {
    Alert,
    Badge,
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Space,
    Switch,
    Table,
    TableProps,
    Tag,
    Typography,
} from 'antd';

import { CompteType } from "../../types/CompteType";
import {CheckOutlined, CloseOutlined, QuestionCircleOutlined, WalletOutlined} from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import { FormInstance } from "antd/lib/form";
import EditableCell from "../shared/EditableCell";
import ErrorResult from "../shared/ErrorResult";
import CompteService from "../../services/CompteService";
import ClientService from "../../services/ClientService";
import { TypeCompteEnum } from "../../types/TypeCompteEnum";
import { ClientType } from "../../types/ClientType";
import { PageHeader } from "@ant-design/pro-layout";
import EditableTableColumnSearch from "../shared/EditableTableColumnSearch";
import axios from "axios";
import {apiRoutes} from "../../routes/backend-config";

const comptesTypes = Object.values(TypeCompteEnum);

const Comptes = () => {
    const [data, setData] = useState<CompteType[]>(null);
    const [clients, setClients] = useState<ClientType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let addForm: FormInstance = null;
    const [selectedType, setSelectedType] = useState<TypeCompteEnum>(null);
    const [errorsAdd, setErrorsAdd] = React.useState<string>('');
    const initialAddValues: CompteType = {
        typeCompte: null,
        numeroCompte: '',
        solde: 0.0,
        tauxInteret: 0.0,
        soldeMinimum: 0.0,
        activated: true,
        client: null,
    };
    const [editForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(null);
    const [editingType, setEditingType] = useState<TypeCompteEnum>(null);
    const isEditing = (record: CompteType) => record.id === editingKey;
    const columns = [
        {
            title: 'Type',
            dataIndex: 'typeCompte',
            editable: false,
            inputType: 'select',
            selectValues: comptesTypes,
            filters: comptesTypes.map((item) => (
                { text: item, value: item }
            )),
            onFilter: (value: string, record: CompteType) => record.typeCompte == value,
            render: (_, {typeCompte}) => {
                let color;
                switch (typeCompte) {
                    case TypeCompteEnum.EPARGNE:
                        color = 'geekblue';
                        break;
                    case TypeCompteEnum.COURANT:
                        color = 'purple';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color} key={typeCompte}>{typeCompte}</Tag>;
            },
        },
        {
            title: 'Document',
            dataIndex: 'numeroCompte',
            editable: true,
            sorter: (a, b) => a.numeroCompte - b.numeroCompte,
            ...EditableTableColumnSearch('numeroCompte'),
        },
        {
            title: 'Client',
            dataIndex: 'client',
            editable: true,
            inputType: 'select',
            selectValues: clients,
            showSearch: true,
            width: '14%',
            sorter: (a, b) => a.client.length - b.client.length,
            render: (_, { client }) => {
                return clients?.find(item => item.id == client).numeroDocument;
            },
            //...EditableTableColumnSearch('client'), // todo check
        },
        {
            title: 'Solde',
            dataIndex: 'solde',
            editable: true,
            inputType: 'number',
            sorter: (a, b) => a.solde - b.solde,
        },
        {
            title: 'Solde Minimum',
            dataIndex: 'soldeMinimum',
            editable: editingType == TypeCompteEnum.COURANT,
            inputType: 'number',
            width: '14%',
            sorter: (a, b) => a.soldeMinimum - b.soldeMinimum,
            render: (_, record) => {
                if (record.typeCompte == TypeCompteEnum.COURANT) {
                    return record.soldeMinimum;
                }
            },
        },
        {
            title: 'Taux Interet',
            dataIndex: 'tauxInteret',
            editable: editingType == TypeCompteEnum.EPARGNE,
            inputType: 'percent',
            width: '12%',
            sorter: (a, b) => a.tauxInteret - b.tauxInteret,
            render: (_, record) => {
                if (record.typeCompte == TypeCompteEnum.EPARGNE) {
                    return record.tauxInteret + ' %';
                }
            },
        },
        {
            title: 'Status',
            dataIndex: 'activated',
            editable: true,
            inputType: 'switch',
            width: '12%',
            filters: ['1', '0'].map((item) => {
                const text = item == '1' ? 'activated' : 'not activated';
                return { text: text.toUpperCase(), value: item }
            }),
            onFilter: (value, record: CompteType) => record.activated == value,
            render: (_, {activated}) => {
                const status = activated ? 'success' : 'error';
                const text = activated ? 'Activated' : 'Not Activated';
                const color = activated ? 'green' : 'red';
                return <Badge status={status} text={text} style={{color : color}} />;
            },
        },
        {
            title: 'Actions',
            width: '12%',
            render: (_, record: CompteType) => {
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
    const mergedColumns: any = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record: CompteType) => ({
                record,
                inputType: col.inputType ?? 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
                selectValues: col.selectValues ?? null,
                showSearch: col.dataIndex == 'client',
            }),
        };
    });

    // actions
    const getComptes = () => {
        setLoading(true);
        CompteService.list_comptes()
            .then((response) => {
                if (response.data) {
                    const data :CompteType[] = response.data?.map((item: CompteType) => (
                        { ...item, client: item.client.id }
                    ));
                    setData(data);
                }
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const getClients = () => {
        ClientService.list_clients()
            .then((response) => {
                if (response.data) {
                    setClients(response.data);
                }
            });
    };
    const toggleAdd = () => {
        addForm?.resetFields();
        setErrorsAdd('');
        setIsModalOpen(true);
    }
    const handleAdd = async (values) => {
        const formValues = updateFormValues(values);
        const result = await CompteService.compte_exists(formValues.numeroCompte);
        if (result.data) {
            setErrorsAdd('Compte with this number already exists')
        } else {
            setErrorsAdd('');
            CompteService.add_compte(formValues)
                .then((response) => {
                    setLoading(true);
                    setIsModalOpen(false);
                    const newRowData: CompteType = response.data;
                    newRowData.client = newRowData.client.id;
                    Notifications.openNotificationWithIcon('success', 'Compte added successfully !');
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
    const toggleEdit = (record: CompteType) => {
        editForm.setFieldsValue({ ...record });
        setEditingKey(record.id);
        setEditingType(record.typeCompte);
    };
    const cancelEdit = () => {
        setEditingKey(null);
        setEditingType(null);
    }
    const saveEdit = async (record: CompteType) => {
        try {
            const formValues = await editForm.validateFields();
            formValues.id = record.id
            let result
            if (formValues.numeroCompte != record.numeroCompte) {
                result = await CompteService.compte_exists(formValues.numeroCompte);
            }
            if (result?.data) {
                Notifications.openNotificationWithIcon('error', 'Compte with this number already exists')
            } else {
                updateFormValues(formValues);
                console.log(formValues);
                CompteService.edit_compte(formValues)
                    .then((response) => {
                        const newRowData: CompteType = response.data;
                        const newData = [...data];
                        const index = newData.findIndex((item) => record.id === item.id);
                        if (index > -1 && newRowData != undefined) {
                            newRowData.client = newRowData.client.id;
                            const item = newData[index];
                            newData.splice(index, 1, {
                                ...item,
                                ...newRowData,
                            });
                            setData(newData);
                            cancelEdit();
                        }
                        Notifications.openNotificationWithIcon('success', 'Compte updated successfully !');
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
        CompteService.delete_compte(id)
            .then((_) => {
                const newData = [...data];
                // update item
                const index = newData.findIndex((item) => id === item.id);
                if (index > -1) {
                    const updatedData = newData.filter((item) => item.id != id);
                    setLoading(false);
                    setData(updatedData);
                    Notifications.openNotificationWithIcon('success', 'Compte deleted successfully !');
                }
            })
            .catch((error) => {
                Notifications.openNotificationWithIcon('error', error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const updateFormValues = (formValues) => {
        if (editingType) {
            formValues.typeCompte = editingType;
        }
        formValues.client = {'id' : formValues.client};
        return formValues;
    }

    useEffect(() => {
        //Runs only on the first render
        getComptes();
        getClients();
    }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }

    return (
        <>
            <PageHeader
                title={'Comptes'}
                extra={[
                    <Button size="large" icon={<WalletOutlined />} onClick={toggleAdd}>
                        Add Compte
                    </Button>,
                ]}
            />
            <Modal
                title="Add Compte"
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
                    onValuesChange={(changedValues) => {
                        if (changedValues.typeCompte) {
                            setSelectedType(changedValues.typeCompte);
                        }
                        setErrorsAdd('');
                    }}
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
                            label="Compte Type"
                            name="typeCompte"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Select>
                                {comptesTypes.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Compte Number"
                            name="numeroCompte"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Input/>
                        </Form.Item>
                        <Form.Item
                            label="Client"
                            name="client"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Select showSearch>
                                {clients?.map(item => <Select.Option value={item.id}>{item.numeroDocument}</Select.Option>)}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="Solde"
                            name="solde"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <InputNumber style={{ width: '100%' }} suffix={'DT'} />
                        </Form.Item>

                        {selectedType === TypeCompteEnum.EPARGNE && (
                            <Form.Item
                                label="Taux interet"
                                name="tauxInteret"
                                rules={[{required: true, message: 'Please enter input value'}]}
                            >
                                <InputNumber<number>
                                    min={0}
                                    max={100}
                                    suffix={'%'}
                                    //formatter={(value) => `${value} %`}
                                    parser={(value) => value?.replace('%', '') as unknown as number}
                                />
                            </Form.Item>
                        )}

                        {selectedType === TypeCompteEnum.COURANT && (
                            <Form.Item
                                label="Solde Minimum"
                                name="soldeMinimum"
                                rules={[{required: true, message: 'Please enter input value'}]}
                            >
                                <InputNumber style={{ width: '100%' }} suffix={'DT'} />
                            </Form.Item>
                        )}
                        <Form.Item label="Status" name="activated">
                            <Switch
                                checkedChildren={<CheckOutlined />}
                                unCheckedChildren={<CloseOutlined />}
                                defaultChecked
                            />
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

export default Comptes;
