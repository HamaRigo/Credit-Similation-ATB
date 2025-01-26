import React, {useState} from 'react';

import {
    Alert,
    Button,
    Form,
    InputNumber,
    Modal,
    Select,
} from 'antd';

import { FormInstance } from "antd/lib/form";

const creditPeriods = Array.from({ length: 20 }, (_, index) => index + 1);
const periodicity = ['Monthly', 'Quarterly', 'Half yearly']

const CreditSimulationModal = ({
                                   idModalOpen,
                                   setIsModalOpen,
                               }) => {
    let simulationForm: FormInstance = null;
    const [simulationResult, setSimulationResult] = useState<number>(null);

    // actions
    const handleSimulation = async (values) => {
        const montant = values.montant
        const interet = values.tauxInteret
        const period = values.period
        const periodicity = values.periodicity
        const total = montant + (interet != null ? montant * (interet / 100) : 0.0)
        const truncateToDecimal = (num, decimals) => {
            const factor = Math.pow(10, decimals);
            return Math.floor(num * factor) / factor;
        };

        let periodIndex
        switch (periodicity) {
            case 'Monthly':
                periodIndex = 12
                break
            case 'Quarterly':
                periodIndex = 3
                break
            case 'Half yearly':
                periodIndex = 2
                break
            default:
                periodIndex = 12
        }
        const result = total / period / periodIndex
        setSimulationResult(result ? truncateToDecimal(result, 3) : null);
    };
    const cancelSimulation = () => {
        setIsModalOpen(false);
        setSimulationResult(null);
        simulationForm?.resetFields();
    }
    
    return (
        <Modal
            title="Credit Simulation"
            open={idModalOpen}
            onOk={handleSimulation}
            onCancel={cancelSimulation}
            centered
            footer={null}
            maskClosable={true}
        >
            <Form
                layout="horizontal"
                ref={(form: any) => (simulationForm = form)}
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={handleSimulation}
                validateTrigger="onSubmit"
            >
                <div style={{margin: '25px 0'}}>
                    <Form.Item
                        label="Amount"
                        name="montant"
                        rules={[{required: true, message: 'Please enter input value'}]}
                    >
                        <InputNumber suffix={'DT'} style={{ width: '100%' }} min={1000} />
                    </Form.Item>
                    <Form.Item
                        label="Repayment period"
                        name="period"
                        rules={[{required: true, message: 'Please enter date period'}]}
                    >
                        <Select showSearch allowClear>
                            {creditPeriods?.map(item => <Select.Option value={item}>{item + (item == 1 ? ' year' : ' years')}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Repayment period" name="periodicity">
                        <Select allowClear>
                            {periodicity?.map(item => <Select.Option value={item}>{item}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Interest Rate" name="tauxInteret">
                        <InputNumber<number>
                            suffix={'%'}
                            min={1}
                            max={100}
                            parser={(value) => value?.replace('%', '') as unknown as number}
                        />
                    </Form.Item>
                    <div className="ant-modal-footer">
                        <Button type="default" onClick={cancelSimulation}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Simulate
                        </Button>
                    </div>
                    {simulationResult ? <>
                        <Alert
                            style={{marginTop: '25px'}}
                            message="Simultation Result"
                            description={simulationResult + ' DT'}
                            type="info"
                            showIcon
                        />
                    </> : null}
                </div>
            </Form>
        </Modal>
    );
}
export default CreditSimulationModal;