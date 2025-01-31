import React, { useState } from 'react';

import {
    Badge,
    Form,
    Popconfirm,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd';

import { CompteType } from "../../types/CompteType";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import EditableCell from "../shared/EditableCell";
import CompteService from "../../services/CompteService";
import { TypeCompteEnum } from "../../types/TypeCompteEnum";
import EditableTableColumnSearch from "../shared/EditableTableColumnSearch";
import { useNavigate } from "react-router-dom";
import {ClientType} from "../../types/ClientType";

const comptesTypes = Object.values(TypeCompteEnum);

interface CompteListProps extends React.HTMLAttributes<HTMLElement> {
    data: CompteType[];
    setData?: any;
    clients?: ClientType[];
    loading?: boolean;
    setLoading?: (load: boolean) => void;
    updateFormValues?: any;
    displayOnly?: boolean;
}

const CompteList: React.FC<React.PropsWithChildren<CompteListProps>> = ({
                        data,
                        setData,
                        clients,
                        loading,
                        setLoading,
                        updateFormValues,
                        displayOnly,

}) => {
    const [editForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(null);
    const [editingType, setEditingType] = useState<TypeCompteEnum>(null);
    const isEditing = (record: CompteType) => record.id == editingKey;
    let columns: any = [
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
            title: 'Number',
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
            sorter: (a, b) => a.client - b.client,
            render: (_, { client }) => {
                const clientDocument = clients?.find(item => item.id == client)?.numeroDocument
                return (displayOnly ? clientDocument : (
                    <Typography.Link onClick={() => showClientDetails(clientDocument, client)}>
                        {clientDocument}
                    </Typography.Link>
                ))
            },
        },
        {
            title: 'Balance',
            dataIndex: 'solde',
            editable: true,
            inputType: 'money',
            sorter: (a, b) => a.solde - b.solde,
            render: (_, { solde }) => {
                return `${solde} DT`;
            },
        },
        {
            title: 'Minimum Balance',
            dataIndex: 'soldeMinimum',
            editable: editingType == TypeCompteEnum.COURANT,
            inputType: 'money',
            width: '15%',
            sorter: (a, b) => a.soldeMinimum - b.soldeMinimum,
            render: (_, record) => {
                if (record.typeCompte == TypeCompteEnum.COURANT) {
                    return `${record.soldeMinimum} DT`;
                }
            },
        },
        {
            title: 'Interest Rate',
            dataIndex: 'tauxInteret',
            editable: editingType == TypeCompteEnum.EPARGNE,
            inputType: 'percent',
            width: '12%',
            sorter: (a, b) => a.tauxInteret - b.tauxInteret,
            render: (_, record) => {
                if (record.typeCompte == TypeCompteEnum.EPARGNE) {
                    return `${record.tauxInteret} %`;
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
            dataIndex: 'actions',
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
                        <Typography.Link className="edit-btn" disabled={editingKey != null} onClick={() => toggleEdit(record)}>
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
        }
    ];

    if (displayOnly) {
        columns = columns.filter(column => column.dataIndex != 'client' && column.dataIndex != 'actions' );
    }

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
    const navigate = useNavigate();

    // actions
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
                updateFormValues(formValues, editingType);
                CompteService.edit_compte(formValues)
                    .then((response) => {
                        const newRowData: CompteType = response.data;
                        const newData = [...data];
                        const index = newData.findIndex((item) => record.id == item.id);
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
                const index = newData.findIndex((item) => id == item.id);
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
    const showClientDetails = (clientDocument: string, clientId: number) => {
        navigate('/clients/' + clientDocument, { state: { clientId: clientId, clients: clients } })
    };

    return (
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
    );
};

export default CompteList;
