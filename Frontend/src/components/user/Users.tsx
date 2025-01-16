import React, {useEffect, useRef, useState} from 'react';

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
    Tag,
    Dropdown,
    Select,
} from 'antd';

import {
    IdcardOutlined,
    MoreOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";
import { PageHeader } from '@ant-design/pro-layout';
import Notifications from "../shared/Notifications";
import { FormInstance } from "antd/lib/form";
import EditableCell from "../shared/EditableCell";
import ErrorResult from "../shared/ErrorResult";
import UserService from "../../services/UserService";
import { UserType } from "../../types/UserType";
import RoleService from '../../services/RoleService';
import { RoleType } from "../../types/RoleType";
import ChangePassword from "./ChangePassword";
import EditableTableColumnSearch from "../shared/EditableTableColumnSearch";

const Users = () => {
    const [data, setData] = useState<UserType[]>(null);
    const [roles, setRoles] = useState<RoleType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    let addForm: FormInstance = null;
    const [errorsModal, setErrorsModal] = React.useState<string>('');
    const initialAddValues: UserType = {
        username: '',
        password: '',
        email: '',
        nom: '',
        prenom: '',
        telephone: '',
        roles: null,
    };
    const [editFormOld] = Form.useForm();
    const editForm = useRef<FormInstance>(null);
    const [editingKey, setEditingKey] = useState<number>(null);
    const [isModalPwdOpen, setIsModalPwdOpen] = useState(false);
    const pwdForm = useRef<FormInstance>(null);
    const [errorsPwd, setErrorsPwd] = React.useState<string>('');

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            editable: true,
            sorter: (a, b) => a.username.length - b.username.length,
            ...EditableTableColumnSearch('username'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            editable: true,
            dataType: 'email',
            sorter: (a, b) => a.email.length - b.email.length,
            ...EditableTableColumnSearch('email'),
        },
        {
            title: 'Phone',
            dataIndex: 'telephone',
            editable: true,
            inputType: 'phone',
            sorter: (a, b) => a.telephone.length - b.telephone.length,
            ...EditableTableColumnSearch('telephone'),
        },
        {
            title: 'Roles',
            dataIndex: 'roles',
            editable: true,
            inputType: 'selectMultiple',
            selectValues: roles,
            width: '25%',
            filters: roles?.map((role) => (
                { text: role.name, value: role.id }
            )),
            onFilter: (id: number, record: UserType) => {
                return record.roles.find(role => role.id == id);
            },
            render: (_, { roles }) => {
                return <>
                    {roles?.map((role: RoleType) => {
                        return (
                            <Tag color={'geekblue'} key={role.id}>
                                {role.name}
                            </Tag>
                        );
                    })}
                </>
            },
        },
        {
            title: 'Actions',
            width: '12%',
            render: (_, record: UserType) => {
                const items = [
                    {
                        key: '1',
                        label: <Typography.Link onClick={() => toggleEdit(record)}>
                            Edit
                        </Typography.Link>,
                        disabled : editingKey !== null,
                    },
                    {
                        key: '2',
                        label: <Typography.Link onClick={togglePasswordChanging}>
                            Change password
                        </Typography.Link>,
                        disabled: editingKey !== null,
                    },
                    {
                        key: '3',
                        label: <Popconfirm
                            placement={'top'}
                            title={'Sure to delete ?'}
                            icon={<QuestionCircleOutlined />}
                            onConfirm={() => handleDelete(record.id)}
                        >
                            <Typography.Link>
                                Delete
                            </Typography.Link>
                        </Popconfirm>,
                        danger: true,
                    },
                ];

                return (
                    <Space direction="vertical">
                        <Dropdown menu={{ items }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                            <MoreOutlined />
                        </Dropdown>
                    </Space>
                );
                /*const editable = isEditing(record);
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
                    <Space direction="vertical">
                        <Dropdown menu={{ items }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
                            <MoreOutlined />
                        </Dropdown>
                    </Space>
                );*/
            },
        },
    ];
    const mergedColumns: any = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: UserType) => ({
                record,
                inputType: col.inputType ?? 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                selectValues: col.selectValues ?? null,
                dataType: col.dataIndex == 'email' ? 'email' : null,
            }),
        };
    });

    // actions
    const getUsers = () => {
        setLoading(true);
        UserService.list_users()
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
    const getRoles = () => {
        RoleService.list_roles()
            .then((response) => {
                setRoles(response.data);
            })
            .finally(() => {
            });
    };
    const toggleAdd = () => {
        addForm?.resetFields();
        setErrorsModal('');
        setIsModalOpen(true);
    }
    const handleAdd = async (values) => {
        const formValues = updateFormValues(values);
        /*const result = await CompteService.compte_exists(formValues.numeroCompte);
        if (result.data) {
            setErrorsModal('User with this username already exists')
        } else {*/
            setErrorsModal('');
            UserService.add_user(formValues)
                .then((response) => {
                    setLoading(true);
                    setIsModalOpen(false);
                    const newRowData: UserType = response.data;
                    Notifications.openNotificationWithIcon('success', 'User added successfully !');
                    //delete data of form
                    addForm?.resetFields();
                    //add data to table
                    setLoading(false);
                    setData([...data, newRowData]);
                })
                .catch((error) => {
                    setErrorsModal(error.message);
                });
        //}
    };
    const cancelAdd = () => setIsModalOpen(false);
    const toggleEdit = (record: UserType) => {
        setErrorsModal('');
        editForm.current?.resetFields();
        editForm.current?.setFieldsValue({ ...record });
        setEditingKey(record.id);
        setIsModalOpen(true);
    };
    const togglePasswordChanging = () => {
        pwdForm.current?.resetFields();
        setErrorsPwd('');
        setIsModalPwdOpen(true);
    };
    const handlePwdChanging = async (values) => {
        console.log('form', values);
    };
    const cancelPwdChanging = () => setIsModalPwdOpen(false);

    const cancelEdit = () => {
        setIsModalOpen(false);
        setEditingKey(null);
    }
    const saveEdit = async () => {
        try {
            const formValues = await editForm.current?.validateFields();
            console.log('editingKey', editingKey);
            console.log('formValues', formValues);
            /*
            updateFormValues()....
            formValues.id = record.id
            UserService.edit_user(formValues)
                .then((response) => {
                    const newRowData: UserType = response.data;
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
                    Notifications.openNotificationWithIcon('success', 'User updated successfully !');
                })
                .catch((error) => {
                    Notifications.openNotificationWithIcon('error', error.message);
                });*/
        } catch (errInfo) {
            Notifications.openNotificationWithIcon('error', errInfo.message);
        }
    };
    const handleDelete = (id: number) => {
        setLoading(true);
        UserService.delete_user(id)
            .then((_) => {
                const newData = [...data];
                // update item
                const index = newData.findIndex((item) => id === item.id);
                if (index > -1) {
                    const updatedData = newData.filter((item) => item.id != id);
                    setLoading(false);
                    setData(updatedData);
                    Notifications.openNotificationWithIcon('success', 'User deleted successfully !');
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
        const roles: RoleType[] = formValues.roles?.map((role) => ({ id: role }));
        formValues.roles = roles;

        return formValues;
    }

    useEffect(() => {
        //Runs only on the first render
        getUsers();
        getRoles();
    }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }

    return (
        <>
            <PageHeader
                title={'Users'}
                extra={[
                    <Button size="large" icon={<IdcardOutlined />} onClick={toggleAdd}>
                        Add User
                    </Button>,
                ]}
            />
            <Modal
                title={editingKey ? 'Edit User' : 'Add User'}
                open={isModalOpen}
                onOk={editingKey ? saveEdit : handleAdd}
                onCancel={editingKey ? cancelEdit : cancelAdd}
                centered
                footer={null}
                maskClosable={true}
            >
                <Form
                    layout="horizontal"
                    ref={editForm}
                    onValuesChange={() => setErrorsModal('')}
                    labelCol={{span: 8}}
                    wrapperCol={{span: 16}}
                    onFinish={editingKey ? saveEdit : handleAdd}
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
                        <Form.Item
                            label="Username"
                            name="username"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <Input/>
                        </Form.Item>
                        {editingKey ? null : (
                            <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please input your password!' }]}
                            >
                                <Input.Password />
                            </Form.Item>
                        )}
                        <Form.Item
                            label="Email"
                            name="email"
                            rules={[
                                {required: true, message: 'Please enter input value'},
                                {type: 'email', message: 'Please enter a valid email'}
                            ]}
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
                            label="Phone"
                            name="telephone"
                            rules={[
                                {required: true, message: 'Please enter input value'},
                                {pattern: /^\d{8}$/, message: 'Phone must be exactly 8 digits!'},
                            ]}
                        >
                            <Input showCount maxLength={8}/>
                        </Form.Item>
                        <Form.Item label="Roles" name="roles">
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                options={roles?.map(role => (
                                    { label: role.name, value: role.id }
                                ))}
                            />
                        </Form.Item>
                        <div className="ant-modal-footer">
                            <Button type="default" onClick={editingKey ? cancelEdit : cancelAdd}>
                                Cancel
                            </Button>
                            <Button type="primary" htmlType="submit">
                                {editingKey ? 'Edit' : 'Create'}
                            </Button>
                        </div>
                    </div>
                </Form>
            </Modal>

            <Modal
                title="Change Password"
                open={isModalPwdOpen}
                onOk={handlePwdChanging}
                onCancel={cancelPwdChanging}
                centered
                footer={null}
                maskClosable={true}
            >
                <ChangePassword
                    pwdForm={pwdForm}
                    handlePwdChanging={handlePwdChanging}
                    cancelPwdChanging={cancelPwdChanging}
                    setErrorsPwd={setErrorsPwd}
                    errorsPwd={errorsPwd}
                />
            </Modal>
            {/*<Form form={editForm} component={false}>*/}
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
            {/*</Form>*/}
        </>
    );
}
export default Users;
