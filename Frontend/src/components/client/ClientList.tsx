import React from 'react';

import {
    Popconfirm,
    Table,
    Typography,
    Space,
    Tag, Dropdown,
} from 'antd';

import ClientService from '../../services/ClientService';
import { ClientType } from "../../types/ClientType";
import {MoreOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import { TypeDocumentEnum } from "../../types/TypeDocumentEnum";
import EditableTableColumnSearch from "../shared/EditableTableColumnSearch";
import { useNavigate } from "react-router-dom";
import {CompteType} from "../../types/CompteType";

interface CompteListProps extends React.HTMLAttributes<HTMLElement> {
    data: CompteType[];
    setData?: any;
    loading?: boolean;
    setLoading?: (load: boolean) => void;
    documentTypes: any,
    displayOnly?: boolean;
    toggleEdit: any,
    toggleUpload: any,
}

const ClientList: React.FC<React.PropsWithChildren<CompteListProps>> = ({
                                                                            data,
                                                                            setData,
                                                                            loading,
                                                                            setLoading,
                                                                            documentTypes,
                                                                            displayOnly,
                                                                            toggleEdit,
                                                                            toggleUpload,
                                                                        }) => {
    const navigate = useNavigate();
    const columns: any = [
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
            ...EditableTableColumnSearch('numeroDocument'),
            render: (_, record) => (
                <Typography.Link onClick={() => showClientDetails(record)}>
                    {record.numeroDocument}
                </Typography.Link>
            )
        },
        {
            title: 'Firstname',
            dataIndex: 'prenom',
            editable: true,
            sorter: (a, b) => a.prenom.length - b.prenom.length,
            ...EditableTableColumnSearch('prenom'),
        },
        {
            title: 'Lastname',
            dataIndex: 'nom',
            editable: true,
            sorter: (a, b) => a.nom.length - b.nom.length,
            ...EditableTableColumnSearch('nom'),
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
            title: 'Accounts',
            dataIndex: 'compteCount',
            editable: false,
            width: '10%',
            sorter: (a, b) => a.compteCount - b.compteCount,
        },
        {
            title: 'Credits',
            dataIndex: 'creditCount',
            editable: false,
            width: '9%',
            sorter: (a, b) => a.creditCount - b.creditCount,
        },
        {
            title: 'Actions',
            width: '16%',
            render: (_, record: ClientType) => {
                /*const items = [
                    {
                        key: '1',
                        label: <Typography.Link onClick={() => toggleEdit(record)}>
                            Edit
                        </Typography.Link>,
                    },
                    {
                        key: '2',
                        label: <Typography.Link onClick={() => toggleUpload(record.id)}>
                            Upload Signature
                        </Typography.Link>,
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
                );*/
                return (
                    <Space size="middle">
                        <Typography.Link className="upload-btn" onClick={() => toggleUpload(record.id)}>
                            Upload
                        </Typography.Link>
                        <Typography.Link className="edit-btn" onClick={() => toggleEdit(record)}>
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

    // actions
    const handleDelete = (id: number) => {
        setLoading(true);
        ClientService.delete_client(id)
            .then((_) => {
                const newData = [...data];
                // update item
                const index = newData.findIndex((item) => id == item.id);
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
    const showClientDetails = (record: ClientType) => {
        navigate('/clients/' + record.numeroDocument, { state: { client: record, clients: data } })
    };

    return (
        <Table
            loading={loading}
            columns={columns}
            dataSource={data}
            showSorterTooltip={{ target: 'sorter-icon' }}
        />
    );
};

export default ClientList;
