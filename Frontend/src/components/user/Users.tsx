import React, {useEffect, useRef, useState} from 'react';

import {
    Form,
    Popconfirm,
    Table,
    Typography,
    Space,
    Button,
    Modal,
    Tag,
    Dropdown,
    Badge,
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
import ChangePasswordModal from "./ChangePasswordModal";
import EditableTableColumnSearch from "../shared/EditableTableColumnSearch";
import UserFormModal from "./UserFormModal";

const Users = () => {
    const [data, setData] = useState<UserType[]>(null);
    const [roles, setRoles] = useState<RoleType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalForm] = Form.useForm();
    const [errorsModal, setErrorsModal] = React.useState<string>('');
    const [editingRecord, setEditingRecord] = useState<UserType>(null);
    const [isModalPwdOpen, setIsModalPwdOpen] = useState(false);
    const pwdForm = useRef<FormInstance>(null);
    const [errorsPwd, setErrorsPwd] = React.useState<string>('');

    const columns: any = [
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
            sorter: (a, b) => a.telephone - b.telephone,
            ...EditableTableColumnSearch('telephone'),
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
            onFilter: (value, record: UserType) => record.activated == value,
            render: (_, {activated}) => {
                const status = activated ? 'success' : 'error';
                const text = activated ? 'Activated' : 'Not Activated';
                const color = activated ? 'green' : 'red';
                return <Badge status={status} text={text} style={{color : color}} />;
            },
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
                        disabled : editingRecord != null,
                    },
                    {
                        key: '2',
                        label: <Typography.Link onClick={() => togglePasswordChanging(record)}>
                            Change password
                        </Typography.Link>,
                        disabled: editingRecord != null,
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
            },
        },
    ];

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
        modalForm.setFieldsValue({activated: true});
        setErrorsModal('')
        setIsModalOpen(true)
    }
    const handleAdd = async (values) => {
        const formValues = updateFormValues(values);
        setErrorsModal('');
        UserService.add_user(formValues)
            .then((response) => {
                setLoading(true);
                setIsModalOpen(false);
                const newRowData: UserType = response.data;
                Notifications.openNotificationWithIcon('success', 'User added successfully !');
                //delete data of form
                modalForm?.resetFields();
                //add data to table
                setLoading(false);
                setData([...data, newRowData]);
            })
            .catch((error) => {
                setErrorsModal(error.response.data != '' ? error.response.data : error.message);
            });
    };
    const cancelAdd = () => {
        modalForm.resetFields();
        setIsModalOpen(false);
    }
    const toggleEdit = (record: UserType) => {
        setErrorsModal('');
        modalForm.setFieldsValue({ ...record, roles: record.roles.map(role => role.id) });
        setEditingRecord(record);
        setIsModalOpen(true);
    };
    const cancelEdit = () => {
        modalForm.resetFields();
        setEditingRecord(null);
        setIsModalOpen(false);
    }
    const saveEdit = (values) => {
        const formValues = updateFormValues(values)
        const editingKey = editingRecord.id
        formValues.id = editingKey
        UserService.edit_user(formValues)
            .then((response) => {
                const newRowData: UserType = response.data;
                const newData = [...data];
                const index = newData.findIndex((item) => item.id == editingKey);
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
                setErrorsModal(error.response.data != '' ? error.response.data : error.message);
            });
    };
    const handleDelete = (id: number) => {
        setLoading(true);
        UserService.delete_user(id)
            .then((_) => {
                const newData = [...data];
                // update item
                const index = newData.findIndex((item) => id == item.id);
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
    const togglePasswordChanging = (record: UserType) => {
        setEditingRecord(record);
        setErrorsPwd('');
        setIsModalPwdOpen(true);
    };
    const handlePwdChanging = async (values) => {
        setErrorsPwd('');
        const oldPassword = values.oldPassword
        editingRecord.password = values.password
        UserService.change_password(editingRecord, oldPassword)
            .then((_) => {
                cancelPwdChanging();
                Notifications.openNotificationWithIcon('success', 'User password changed successfully !');
            })
            .catch((error) => {
                setErrorsPwd(error.response.data != '' ? error.response.data : error.message);
            });
    };
    const cancelPwdChanging = () => {
        setEditingRecord(null);
        pwdForm.current?.resetFields();
        setIsModalPwdOpen(false);
    }
    const updateFormValues = (formValues) => {
        if (formValues.roles) {
            const selectedRoleIds = formValues.roles
            formValues.roles = roles.filter(role => selectedRoleIds.includes(role.id));
        }
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
            <UserFormModal
                modalForm={modalForm}
                isModalOpen={isModalOpen}
                isEditing={editingRecord != null}
                roles={roles}
                onSave={editingRecord ? saveEdit : handleAdd}
                onCancel={editingRecord ? cancelEdit : cancelAdd}
                errorsModal={errorsModal}
                setErrorsModal={setErrorsModal}
            />
            <ChangePasswordModal
                pwdForm={pwdForm}
                isModalOpen={isModalPwdOpen}
                handlePwdChanging={handlePwdChanging}
                cancelPwdChanging={cancelPwdChanging}
                setErrorsPwd={setErrorsPwd}
                errorsPwd={errorsPwd}
            />
            <Table
                loading={loading}
                columns={columns}
                dataSource={data}
                rowClassName="editable-row"
                pagination={{ onChange: cancelEdit }}
                showSorterTooltip={{ target: 'sorter-icon' }}
            />
        </>
    );
}
export default Users;
