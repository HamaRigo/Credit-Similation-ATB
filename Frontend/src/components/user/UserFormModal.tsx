import React from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Switch,
    Button,
    Alert,
} from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const UserFormModal = ({
                           modalForm,
                           isModalOpen,
                           isEditing,
                           roles,
                           onSave,
                           onCancel,
                           errorsModal,
                           setErrorsModal,
                       }) => {
    return (
        <Modal
            title={isEditing ? "Edit User" : "Add User"}
            open={isModalOpen}
            onCancel={onCancel}
            centered
            footer={null}
            maskClosable={true}
        >
            <Form
                form={modalForm}
                layout="horizontal"
                onValuesChange={() => setErrorsModal("")}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={(values) => onSave(values)}
                validateTrigger="onSubmit"
            >
                <div style={{ margin: "25px 0" }}>
                    {errorsModal && (
                        <Alert
                            type="error"
                            className="alert-msg"
                            message={errorsModal}
                            showIcon
                            style={{ marginBottom: "20px" }}
                        />
                    )}
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: "Please enter a username" }]}
                    >
                        <Input />
                    </Form.Item>
                    {!isEditing && (
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[
                                { required: true, message: "Please input your password!" },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    )}
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: "Please enter an email" },
                            { type: "email", message: "Please enter a valid email" },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Phone"
                        name="telephone"
                        rules={[
                            { required: true, message: "Please enter a phone number" },
                            { pattern: /^\d{8}$/, message: "Phone must be exactly 8 digits!" },
                        ]}
                    >
                        <Input showCount maxLength={8} />
                    </Form.Item>
                    <Form.Item label="Firstname" name="prenom">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Lastname" name="nom">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Roles" name="roles">
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: "100%" }}
                            options={roles?.map((role) => ({
                                label: role.name,
                                value: role.id,
                            }))}
                        />
                    </Form.Item>
                    <Form.Item label="Status" name="activated" valuePropName="checked">
                        <Switch
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                        />
                    </Form.Item>
                    <div className="ant-modal-footer">
                        <Button type="default" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit">
                            {isEditing ? "Save" : "Create"}
                        </Button>
                    </div>
                </div>
            </Form>
        </Modal>
    );
};

export default UserFormModal;
