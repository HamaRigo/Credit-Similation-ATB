import React from 'react';
import {Table, Typography, Popconfirm, Tag, Badge} from 'antd';
import { QuestionCircleOutlined } from "@ant-design/icons";
import {OcrType} from "../../types/OcrType";
import {TypeOcrEnum} from "../../types/TypeOcrEnum";
import CompteService from "../../services/CompteService";
import Notifications from "../shared/Notifications";
import EditableTableColumnSearch from "../shared/EditableTableColumnSearch";
import OcrService from "../../services/OcrService";

interface OcrListProps extends React.HTMLAttributes<HTMLElement> {
    data: OcrType[];
    setData?: any;
    loading?: boolean;
    setLoading?: (load: boolean) => void;
    documentTypes: string[];
}

const OcrList: React.FC<React.PropsWithChildren<OcrListProps>> = ({
                               data,
                               setData,
                               loading,
                               setLoading,
                               documentTypes,
                           }) => {
    // Table columns
    const columns: any = [
        {
            title: 'Type',
            dataIndex: 'typeDocument',
            width: '18%',
            filters: documentTypes?.map((item) => (
                { text: item, value: item }
            )),
            onFilter: (value: string, record: OcrType) => record.typeDocument == value,
            render: (_, {typeDocument}) => {
                let color;
                switch (typeDocument) {
                    case TypeOcrEnum.check:
                        color = 'orange';
                        break;
                    case TypeOcrEnum.commercial:
                        color = 'geekblue';
                        break;
                    default:
                        color = 'default';
                }
                return <Tag color={color} key={typeDocument}>{typeDocument}</Tag>;
            },
        },
        {
            title: 'Account',
            dataIndex: 'compte',
            sorter: (a, b) => a.compte.numeroCompte - b.compte.numeroCompte,
            render: (_, { compte }) => {
                return compte.numeroCompte;
            },
        },
        {
            title: 'Score',
            dataIndex: 'confidenceScore',
            sorter: (a, b) => a.confidenceScore - b.confidenceScore,
        },
        {
            title: 'Errors',
            dataIndex: 'errorMessage',
            width: '20%',
            ...EditableTableColumnSearch('errorMessage'),
        },
        {
            title: 'Status',
            dataIndex: 'fraud',
            width: '14%',
            filters: ['1', '0'].map((item) => {
                const text = item == '1' ? 'fraud' : 'not fraud';
                return { text: text.toUpperCase(), value: item }
            }),
            onFilter: (value, record: OcrType) => record.fraud == value,
            render: (_, {fraud}) => {
                const status = !fraud ? 'success' : 'error';
                const text = !fraud ? 'Not Fraud' : 'Fraud';
                const color = !fraud ? 'green' : 'red';
                return <Badge status={status} text={text} style={{color : color}} />;
            },
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            width: '12%',
            render: (_: any, record: OcrType) => (
                <Popconfirm
                    title={'Sure to delete ?'}
                    icon={<QuestionCircleOutlined />}
                    onConfirm={() => handleDelete(record.id)}
                >
                    <Typography.Link className="delete-btn">
                        Delete
                    </Typography.Link>
                </Popconfirm>
            ),
        },
    ];
    const handleDelete = (id: number) => {
        setLoading(true);
        OcrService.delete_ocr(id)
            .then((_) => {
                const newData = [...data];
                // update item
                const index = newData.findIndex((item) => id == item.id);
                if (index > -1) {
                    const updatedData = newData.filter((item) => item.id != id);
                    setLoading(false);
                    setData(updatedData);
                    Notifications.openNotificationWithIcon('success', 'Ocr deleted successfully !');
                }
            })
            .catch((error) => {
                Notifications.openNotificationWithIcon('error', error.message);
            })
            .finally(() => {
                setLoading(false);
            });
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

export default OcrList;