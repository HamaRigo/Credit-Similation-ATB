import React, {useEffect} from "react";
import {Alert, Button, Form, Input, Modal} from "antd";
import {FormInstance} from "antd/lib/form";

type Props = {
    pwdForm: React.RefObject<FormInstance>;
    handlePwdChanging: any;
    cancelPwdChanging: () => void;
    setErrorsPwd: (error: string) => void;
    errorsPwd: string;
};

const ChangePassword = (props: Props) => {
    const initialPwdValues = {
        password: '',
        confirmPassword: '',
    };

    useEffect(() => {
        if (props.pwdForm && props.pwdForm.current) {
            props.pwdForm.current.setFieldsValue(initialPwdValues);
        }
    }, [props.pwdForm]);

    return (
        <Form
            layout="horizontal"
            ref={props.pwdForm}
            initialValues={initialPwdValues}
            onValuesChange={() => props.setErrorsPwd('')}
            labelCol={{span: 8}}
            wrapperCol={{span: 16}}
            onFinish={props.handlePwdChanging}
            validateTrigger="onSubmit"
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
                    name="password"
                    label="Password"
                    rules={[
                        {required: true, message: 'Please input your password!'},
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
                            message: 'Please confirm your password!',
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('The new password that you entered do not match!'));
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
                        Create
                    </Button>
                </div>
            </div>
        </Form>
    );
}
export default ChangePassword;
