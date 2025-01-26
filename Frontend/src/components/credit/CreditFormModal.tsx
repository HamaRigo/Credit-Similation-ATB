import React from 'react';

import {
    Alert,
    Button,
    Form,
    InputNumber,
    Modal,
    Select,
} from 'antd';

import { CreditType } from "../../types/CreditType";

const CreditFormModal = ({
                             modalForm,
                             clients,
                             creditPeriods,
                             creditTypes,
                             isModalOpen,
                             onSave,
                             onCancel,
                             errorsModal,
                         }) => {
    const initialAddValues: CreditType = {
        type: null,
        status: null,
        tauxInteret: null,
        montant: null,
        paiementMensuel: null,
        client: null,
    };

    return (
        <Modal
            title="Add Credit"
            open={isModalOpen}
            onOk={onSave}
            onCancel={onCancel}
            centered
            footer={null}
            maskClosable={true}
        >
            <Form
                layout="horizontal"
                ref={(form: any) => (modalForm = form)}
                initialValues={initialAddValues}
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={onSave}
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
                        label="Repayment period"
                        name="period"
                        rules={[{required: true, message: 'Please enter date period'}]}
                    >
                        <Select showSearch>
                            {creditPeriods?.map(item => <Select.Option value={item}>{item + (item == 1 ? ' year' : ' years')}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Amount"
                        name="montant"
                        rules={[{required: true, message: 'Please enter input value'}]}
                    >
                        <InputNumber suffix={'DT'} style={{ width: '100%' }} min={1000} />
                    </Form.Item>
                    <Form.Item
                        label="Monthly Payment"
                        name="paiementMensuel"
                        rules={[{required: true, message: 'Please enter input value'}]}
                    >
                        <InputNumber suffix={'DT'} style={{ width: '100%' }} min={50} />
                    </Form.Item>
                    <Form.Item
                        label="Interest Rate"
                        name="tauxInteret"
                        rules={[{required: true, message: 'Please enter input value'}]}
                    >
                        <InputNumber<number>
                            suffix={'%'}
                            min={1}
                            max={100}
                            parser={(value) => value?.replace('%', '') as unknown as number}
                        />
                    </Form.Item>
                    <div className="ant-modal-footer">
                        <Button type="default" onClick={onCancel}>
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
}
export default CreditFormModal;