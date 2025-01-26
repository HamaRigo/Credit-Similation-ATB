import React from "react";
import {Alert, Button, Form, Input, Modal} from "antd";
import {FormInstance} from "antd/lib/form";

type Props = {
    pwdForm: React.RefObject<FormInstance>;
    handlePwdChanging: any;
    cancelPwdChanging: () => void;
    setErrorsPwd: (error: string) => void;
    errorsPwd: string;
    isModalOpen: any;
};

const ChangePasswordModal = (props: Props) => {
    const initialPwdValues = {
        oldPassword: '',
        password: '',
        confirmPassword: '',
    };

    return (
        <Modal
            title="Change Password"
            open={props.isModalOpen}
            onOk={props.handlePwdChanging}
            onCancel={props.cancelPwdChanging}
            centered
            footer={null}
            maskClosable={true}
        >
            <Form
                layout="horizontal"
                ref={props.pwdForm}
                initialValues={initialPwdValues}
                onValuesChange={() => props.setErrorsPwd('')}
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                onFinish={props.handlePwdChanging}
            >
                <div style={{margin: '25px 0'}}>
                    {props.errorsPwd != '' && (
                        <Alert
                            type="error"
                            message={props.errorsPwd}
                            showIcon
                            style={{marginBottom: '20px'}}
                        />
                    )}
                    <Form.Item
                        name="oldPassword"
                        label="Old Password"
                        rules={[
                            {required: true, message: 'Please input your password!'},
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {required: true, message: 'Please input your password'},
                        ]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: true,
                                message: 'Please confirm your password',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') == value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords not matching'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <div className="ant-modal-footer">
                        <Button type="default" onClick={props.cancelPwdChanging}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            Update
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
}
export default ChangePasswordModal;
