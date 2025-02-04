import React, {useState} from 'react';

import {
    Badge,
    Form,
    Popconfirm,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd';

import {
    QuestionCircleOutlined,
} from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import EditableCell from "../shared/EditableCell";
import { StatusCreditEnum } from "../../types/StatusCreditEnum";
import { CreditType } from "../../types/CreditType";
import CreditService from "../../services/CreditService";
import {useNavigate} from "react-router-dom";
import {ClientType} from "../../types/ClientType";
import {TypeCredit} from "../../types/TypeCredit";
import dayjs from "dayjs";

const creditPeriods = Array.from({ length: 20 }, (_, index) => index + 1);
const creditStatus = Object.values(StatusCreditEnum);
const dateFormat = 'DD-MM-YYYY';

interface CreditListProps extends React.HTMLAttributes<HTMLElement> {
    data: CreditType[];
    setData?: (credits: CreditType[]) => void;
    clients?: ClientType[];
    creditTypes?: TypeCredit[];
    loading?: boolean;
    setLoading?: (load: boolean) => void;
    updateFormValues?: any;
    displayOnly?: boolean;
}

const CreditList: React.FC<React.PropsWithChildren<CreditListProps>> = ({
                        data,
                        setData,
                        clients,
                        creditTypes,
                        loading,
                        setLoading,
                        updateFormValues,
                        displayOnly,
                    }) => {
    const [editForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(null);
    const isEditing = (record: CreditType) => record.id == editingKey;
    const navigate = useNavigate();

    let columns: any = [
        {
            title: 'Type',
            dataIndex: 'type',
            editable: true,
            inputType: 'select',
            width: '10%',
            selectValues: creditTypes?.map(item => item.name),
            filters: creditTypes?.map((item) => (
                { text: item.name, value: item.name }
            )),
            onFilter: (value: string, record: CreditType) => record.type == value,
            render: (_, { type }) => {
                const color = creditTypes?.find(item => item.name == type)?.color ?? 'default';
                return <Tag color={color} key={type}>{type}</Tag>;
            },
        },
        {
            title: 'Client',
            dataIndex: 'client',
            editable: true,
            inputType: 'select',
            selectValues: clients,
            showSearch: true,
            width: '10%',
            sorter: (a, b) => a.client - b.client,
            render: (_, { client }) => {
                const clientDocument = clients?.find(item => item.id == client)?.numeroDocument
                return (displayOnly ? clientDocument : (
                    <Typography.Link onClick={() => showClientDetails(clientDocument, client)}>
                        {clientDocument}
                    </Typography.Link>
                ));
            },
        },
        {
            title: 'Start Date',
            dataIndex: 'startDate',
            inputType: 'datePicker',
            editable: false,
            width: '13%',
            render: (_, { startDate }) => {
                return startDate ? dayjs(startDate).format(dateFormat) : null;
            },
        },
        {
            title: 'Amount',
            dataIndex: 'montant',
            editable: true,
            inputType: 'money',
            width: '12%',
            sorter: (a, b) => a.montant - b.montant,
            render: (_, { montant }) => {
                return montant + ' DT';
            },
        },
        {
            title: 'Monthly Payment',
            dataIndex: 'paiementMensuel',
            editable: true,
            inputType: 'money',
            width: '12%',
            sorter: (a, b) => a.paiementMensuel - b.paiementMensuel,
            render: (_, { paiementMensuel }) => {
                return paiementMensuel + ' DT';
            },
        },
        {
            title: 'Period',
            dataIndex: 'period',
            inputType: 'select',
            selectValues: creditPeriods,
            editable: true,
            sorter: (a, b) => a.period - b.period,
            filters: creditPeriods.map((item) => (
                { text: item, value: item }
            )),
            onFilter: (value: number, record: CreditType) => record.period == value,
            render: (_, { period }) => {
                return period + ' year(s)';
            },
        },
        {
            title: 'Interest',
            dataIndex: 'tauxInteret',
            editable: true,
            inputType: 'percent',
            sorter: (a, b) => a.tauxInteret - b.tauxInteret,
            render: (_, { tauxInteret }) => {
                return tauxInteret + ' %';
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            editable: true,
            inputType: 'select',
            selectValues: creditStatus,
            width: '13%',
            filters:  creditStatus.map((item) => (
                { text: item, value: item }
            )),
            onFilter: (value: string, record: CreditType) => record.status == value,
            render: (_, {status}) => {
                let badgeStatus, color;
                switch (status) {
                    case StatusCreditEnum.PENDING:
                        badgeStatus = 'warning';
                        color = '#faad14';
                        break;
                    case StatusCreditEnum.IN_PROGRESS:
                        status = 'IN PROGRESS'
                        badgeStatus = 'processing';
                        color = '#1677ff';
                        break;
                    case StatusCreditEnum.APPROVED:
                        badgeStatus = 'success';
                        color = '#4db31b';
                        break;
                    case StatusCreditEnum.REJECTED:
                        badgeStatus = 'error';
                        color = '#ff4d4f';
                        break;
                    default:
                        badgeStatus = 'default';
                        color = 'grey';
                }
                return <Badge status={badgeStatus} text={status} style={{color : color}} />;
            },
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            width: '13%',
            render: (_, record: CreditType) => {
                const updatableStatus = [
                    StatusCreditEnum.PENDING,
                    StatusCreditEnum.REJECTED
                ]
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
                ) : (updatableStatus.includes(record.status) ?
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
                    </Space> : null);
            },
        },
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
            onCell: (record: CreditType) => ({
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
    const toggleEdit = (record: CreditType) => {
        editForm.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };
    const cancelEdit = () => {
        setEditingKey(null);
    }
    const saveEdit = async (record: CreditType) => {
        try {
            const formValues = await editForm.validateFields();
            formValues.id = record.id
            formValues.startDate = record.startDate
            updateFormValues(formValues);
            CreditService.edit_credit(formValues)
                .then((response) => {
                    const newRowData: CreditType = response.data;
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
                    Notifications.openNotificationWithIcon('success', 'Credit updated successfully !');
                })
                .catch((error) => {
                    Notifications.openNotificationWithIcon('error', error.message);
                });
        } catch (errInfo) {
            Notifications.openNotificationWithIcon('error', errInfo.message);
        }
    };
    const handleDelete = (id: number) => {
        setLoading(true);
        CreditService.delete_credit(id)
            .then((_) => {
                const newData = [...data];
                // update item
                const index = newData.findIndex((item) => id == item.id);
                if (index > -1) {
                    const updatedData = newData.filter((item) => item.id != id);
                    setLoading(false);
                    setData(updatedData);
                    Notifications.openNotificationWithIcon('success', 'Credit deleted successfully !');
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
}
export default CreditList;