import React, { useEffect, useState } from 'react';

import {
    Form,
    Input,
    Popconfirm,
    Table,
    Typography,
    Space,
    Button,
    Modal,
    Alert,
} from 'antd';

import RoleService from '../../services/RoleService';
import { RoleType } from "../../types/RoleType";
import { SafetyCertificateOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { PageHeader } from '@ant-design/pro-layout';
import Notifications from "../shared/Notifications";
import { FormInstance } from "antd/lib/form";
import EditableCell from "../shared/EditableCell";
import ErrorResult from "../shared/ErrorResult";
import EditableTableColumnSearch from "../shared/EditableTableColumnSearch";

const Roles = () => {
    const [data, setData] = useState<RoleType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let addForm: FormInstance = null;
    const [errorsAdd, setErrorsAdd] = React.useState<string>('');
    const initialAddValues: RoleType = {
        name: '',
    };
    const [editForm] = Form.useForm();
    const [editingKey, setEditingKey] = useState<number>(null);
    const isEditing = (record: RoleType) => record.id == editingKey;
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            editable: true,
            sorter: (a, b) => a.name.length - b.name.length,
            ...EditableTableColumnSearch('name'),
        },
        {
            title: 'Users',
            dataIndex: 'userCount',
            editable: false,
            width: '30%',
            sorter: (a, b) => a.userCount - b.userCount,
        },
        {
            title: 'Actions',
            width: '12%',
            render: (_, record: RoleType) => {
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
        },
    ];
    const mergedColumns: any = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: RoleType) => ({
                record,
                inputType: 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    // actions
    const getRoles = () => {
        setLoading(true);
        RoleService.list_roles()
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
        setErrorsAdd('');
        setIsModalOpen(true);
    }
    const handleAdd = async (values) => {
        const formValues: RoleType = values;
        const result = await RoleService.role_exists(formValues.name);
        if (result.data) {
            setErrorsAdd('Role with this name already exists')
        } else {
            setErrorsAdd('');
            RoleService.add_role(formValues)
                .then((response) => {
                    setLoading(true);
                    setIsModalOpen(false);
                    const newRowData: RoleType = response.data;
                    Notifications.openNotificationWithIcon('success', 'Role added successfully !');
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
    const cancelAdd = () => {
        addForm?.resetFields();
        setIsModalOpen(false);
    }
    const toggleEdit = (record: RoleType) => {
        editForm.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };
    const cancelEdit = () => setEditingKey(null);
    const saveEdit = async (record: RoleType) => {
        try {
            const formValues = await editForm.validateFields();
            formValues.id = record.id
            let result
            if (formValues.name != record.name) {
                result = await RoleService.role_exists(formValues.name);
            }
            if (result?.data) {
                Notifications.openNotificationWithIcon('error', 'Role with this name already exists')
            } else {
                RoleService.edit_role(formValues)
                    .then((response) => {
                        const newRowData: RoleType = response.data;
                        const newData = [...data];
                        const index = newData.findIndex((item) => record.id == item.id);
                        if (index > -1 && newRowData != undefined) {
                            const item = newData[index];
                            newData.splice(index, 1, {
                                ...item,
                                ...newRowData,
                            });
                            setData(newData);
                            cancelEdit();
                        }
                        Notifications.openNotificationWithIcon('success', 'Role updated successfully !');
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
        RoleService.delete_role(id)
            .then((_) => {
                const newData = [...data];
                // update item
                const index = newData.findIndex((item) => id == item.id);
                if (index > -1) {
                    const updatedData = newData.filter((item) => item.id != id);
                    setLoading(false);
                    setData(updatedData);
                    Notifications.openNotificationWithIcon('success', 'Role deleted successfully !');
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
        getRoles();
    }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }
    
    return (
        <>
            <PageHeader
                title={'Roles'}
                extra={[
                    <Button size="large" icon={<SafetyCertificateOutlined />} onClick={toggleAdd}>
                        Add Role
                    </Button>,
                ]}
            />
            <Modal
                title="Add Role"
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
                            label="Role"
                            name="name"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Input/>
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
export default Roles;
