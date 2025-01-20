import React, {useEffect, useState} from 'react';

import {
    Alert,
    Badge,
    Button,
    Form,
    InputNumber,
    Modal,
    Popconfirm,
    Select,
    Space,
    DatePicker,
    Table,
    Tag,
    Typography,
} from 'antd';

import { MoneyCollectOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import { FormInstance } from "antd/lib/form";
import EditableCell from "../shared/EditableCell";
import ErrorResult from "../shared/ErrorResult";
import { PageHeader } from "@ant-design/pro-layout";
import { TypeCreditEnum } from "../../types/TypeCreditEnum";
import { StatusCreditEnum } from "../../types/StatusCreditEnum";
import { CreditType } from "../../types/CreditType";
import { ClientType } from "../../types/ClientType";
import ClientService from "../../services/ClientService";
import CreditService from "../../services/CreditService";
import dayjs from "dayjs";

const creditTypes = Object.values(TypeCreditEnum);
const creditStatus = Object.values(StatusCreditEnum);
const { RangePicker } = DatePicker;
const dateFormat = 'DD-MM-YYYY';

const Credits = () => {
    const [data, setData] = useState<CreditType[]>(null);
    const [clients, setClients] = useState<ClientType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let addForm: FormInstance = null;
    const [selectedType, setSelectedType] = useState<TypeCreditEnum>(null);
    const [errorsAdd, setErrorsAdd] = React.useState<string>('');
    const initialAddValues: CreditType = {
        type: null,
        status: null,
        tauxInteret: 0.0,
        montant: 0.0,
        paiementMensuel: 0.0,
        client: null,
    };
    const [editForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(null);
    const [editingType, setEditingType] = useState<TypeCreditEnum>(null);
    const isEditing = (record: CreditType) => record.id === editingKey;
    const columns = [
        {
            title: 'Type',
            dataIndex: 'type',
            editable: true,
            width: '8%',
            inputType: 'select',
            selectValues: creditTypes,
            filters: creditTypes.map((item) => (
                { text: item, value: item }
            )),
            onFilter: (value: string, record: CreditType) => record.type == value,
            render: (_, { type }) => {
                let color;
                switch (type) {
                    case TypeCreditEnum.PERSONAL:
                        color = 'geekblue';
                        break;
                    case TypeCreditEnum.AUTO:
                        color = 'purple';
                        break;
                    default:
                        color = 'default';
                }
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
            width: '12%',
            sorter: (a, b) => a.client.length - b.client.length,
            render: (_, { client }) => {
                return clients?.find(item => item.id == client).numeroDocument;
            },
        },
        {
            title: 'Date Debut',
            dataIndex: 'dateDebut',
            inputType: 'datePicker',
            editable: true,
            width: '10%',
            render: (_, record) => {
                return dayjs(record.dateDebut).format(dateFormat);
            },
        },
        {
            title: 'Date Fin',
            dataIndex: 'dateFin',
            inputType: 'datePicker',
            editable: true,
            width: '10%',
            render: (_, {dateFin}) => {
                return dayjs(dateFin).format(dateFormat);
            },
        },
        {
            title: 'Montant',
            dataIndex: 'montant',
            editable: true,
            inputType: 'number',
            width: '10%',
            sorter: (a, b) => a.montant - b.montant,
        },
        {
            title: 'Paiement Mensuel',
            dataIndex: 'paiementMensuel',
            editable: true,
            inputType: 'number',
            width: '10%',
            sorter: (a, b) => a.paiementMensuel - b.paiementMensuel,
        },
        {
            title: 'Taux Interet',
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
            width: '12%',
            render: (_, record: CreditType) => {
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
                    record.status == StatusCreditEnum.PENDING ?
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
                    </Space> : null
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
    const getCredits = () => {
        setLoading(true);
        CreditService.list_credits()
            .then((response) => {
                if (response.data) {
                    const data :CreditType[] = response.data?.map((item: CreditType) => (
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
        formValues.status = StatusCreditEnum.PENDING;
        setErrorsAdd('');
        CreditService.add_credit(formValues)
            .then((response) => {
                setLoading(true);
                setIsModalOpen(false);
                const newRowData: CreditType = response.data;
                newRowData.client = newRowData.client.id;
                Notifications.openNotificationWithIcon('success', 'Credit added successfully !');
                //delete data of form
                addForm?.resetFields();
                //add data to table
                setLoading(false);
                setData([...data, newRowData]);
            })
            .catch((error) => {
                setErrorsAdd(error.message);
            });
    };
    const cancelAdd = () => setIsModalOpen(false);
    const toggleEdit = (record: CreditType) => {
        editForm.setFieldsValue({ ...record });
        setEditingKey(record.id);
        setEditingType(record.type);
    };
    const cancelEdit = () => {
        setEditingKey(null);
        setEditingType(null);
    }
    const saveEdit = async (record: CreditType) => {
        try {
            const formValues = await editForm.validateFields();
            formValues.id = record.id
            updateFormValues(formValues);
            CreditService.edit_credit(formValues)
                .then((response) => {
                    const newRowData: CreditType = response.data;
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
                const index = newData.findIndex((item) => id === item.id);
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
    const updateFormValues = (formValues) => {
        const pattern = 'YYYY-MM-DD'
        if (formValues.period) {
            const [startDate, endDate] = formValues.period;
            const formattedStartDate = dayjs(startDate).format(pattern);
            const formattedEndDate = dayjs(endDate).format(pattern);
            formValues.dateDebut = formattedStartDate
            formValues.dateFin = formattedEndDate
        }
        formValues.client = {'id' : formValues.client};
        return formValues;
    }

    useEffect(() => {
        //Runs only on the first render
        getCredits();
        getClients();
    }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }
    
    return (
        <>
            <PageHeader
                title={'Credits'}
                extra={[
                    <Button size="large" icon={<MoneyCollectOutlined />} onClick={toggleAdd}>
                        Add Credit
                    </Button>,
                ]}
            />
            <Modal
                title="Add Credit"
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
                            label="Type"
                            name="type"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Select>
                                {creditTypes.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
                            </Select>
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
                            label="Period"
                            name="period"
                            rules={[{required: true, message: 'Please enter date period'}]}
                        >
                            <RangePicker
                                format={dateFormat}
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Montant"
                            name="montant"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <InputNumber suffix={'DT'} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="Paiement Mensuel"
                            name="paiementMensuel"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <InputNumber suffix={'DT'} style={{ width: '100%' }} />
                        </Form.Item>
                        <Form.Item
                            label="Taux interet"
                            name="tauxInteret"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <InputNumber<number>
                                suffix={'%'}
                                min={0}
                                max={100}
                                //formatter={(value) => `${value} %`}
                                parser={(value) => value?.replace('%', '') as unknown as number}
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
}
export default Credits;