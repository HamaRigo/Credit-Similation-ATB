import React, { useEffect, useState } from 'react';

import {
    Alert,
    Button,
    Form,
    Input,
    InputNumber,
    Modal,
    Select,
    Switch,
} from 'antd';

import { CompteType } from "../../types/CompteType";
import {CheckOutlined, CloseOutlined, WalletOutlined} from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import { FormInstance } from "antd/lib/form";
import ErrorResult from "../shared/ErrorResult";
import CompteService from "../../services/CompteService";
import ClientService from "../../services/ClientService";
import { TypeCompteEnum } from "../../types/TypeCompteEnum";
import { ClientType } from "../../types/ClientType";
import { PageHeader } from "@ant-design/pro-layout";
import CompteList from './CompteList';

const comptesTypes = Object.values(TypeCompteEnum);

const CompteFormModal = ({
                             data,
                             setData,
                             setLoading,
                             clients,
                             isModalOpen,
                             setIsModalOpen,
                             errorsAdd,
                             setErrorsAdd,
                             updateFormValues,
                         }) => {
    let addForm: FormInstance = null;
    const [selectedType, setSelectedType] = useState<TypeCompteEnum>(null);
    const initialAddValues: CompteType = {
        typeCompte: null,
        numeroCompte: '',
        solde: null,
        tauxInteret: null,
        soldeMinimum: null,
        activated: true,
        client: null,
    };

    // actions
    const handleAdd = async (values) => {
        const formValues = updateFormValues(values, null);
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
    const cancelAdd = () => {
        addForm?.resetFields();
        setIsModalOpen(false);
    }

    return (
        <Modal
            title="Add Account"
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
                        label="Account Type"
                        name="typeCompte"
                        rules={[{required: true, message: 'Please enter input value'}]}
                    >
                        <Select>
                            {comptesTypes.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Account Number"
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
                        label="Balance"
                        name="solde"
                        rules={[{required: true, message: 'Please enter input value'}]}
                    >
                        <InputNumber suffix={'DT'} style={{ width: '100%' }} min={1000} />
                    </Form.Item>

                    {selectedType == TypeCompteEnum.EPARGNE && (
                        <Form.Item
                            label="Interest Rate"
                            name="tauxInteret"
                            rules={[{required: true, message: 'Please enter input value'}]}
                        >
                            <InputNumber<number>
                                min={0}
                                max={100}
                                suffix={'%'}
                                parser={(value) => value?.replace('%', '') as unknown as number}
                            />
                        </Form.Item>
                    )}

                    {selectedType == TypeCompteEnum.COURANT && (
                        <Form.Item
                            label="Minimum Balance"
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
    );
};

export default CompteFormModal;
