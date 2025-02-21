import React, {useState} from "react";
import {
    Modal,
    Form,
    Input,
    Select,
    Button,
    Alert
} from "antd";
import {TypeDocumentEnum} from "../../types/TypeDocumentEnum";

const ClientFormModal = ({
                           modalForm,
                           documentTypes,
                           isModalOpen,
                           isEditing,
                           onSave,
                           onCancel,
                           errorsModal,
                           setErrorsModal,
                       }) => {
    const [selectedType, setSelectedType] = useState<TypeDocumentEnum>(null);

    const getDocumentNumberPattern = (type : TypeDocumentEnum) => {
        return type == TypeDocumentEnum.CIN ? {
            pattern: /^[0-9]{8}$/,
            message: "CIN must be exactly 8 numeric digits",
        } : type == TypeDocumentEnum.PASSEPORT ? {
            pattern: /^[A-Z0-9]{6,9}$/,
            message: "Passport must be 6 to 9 alphanumeric characters",
        } : type == TypeDocumentEnum.PERMIS ? {
            pattern: /^[A-Z0-9\- ]{6,16}$/,
            message: "Permis must be 6 to 16 alphanumeric characters",
        } : null
    }

    return (
        <Modal
            title={isEditing ? "Edit Client" : "Add Client"}
            open={isModalOpen}
            onOk={onSave}
            onCancel={onCancel}
            centered
            footer={null}
            maskClosable={true}
        >
            <Form
                form={modalForm}
                layout="horizontal"
                onValuesChange={(changedValues) => {
                    if (changedValues.typeDocument) {
                        setSelectedType(changedValues.typeDocument);
                    }
                    setErrorsModal('');
                }}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={(values) => onSave(values)}
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
                        label="Document Type"
                        name="typeDocument"
                        rules={[{required: true, message: 'Please enter input value'}]}
                    >
                        <Select>
                            {documentTypes.map(item => <Select.Option value={item} key={item}>{item}</Select.Option>)}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Document Number"
                        name="numeroDocument"
                        rules={[
                            {
                                required: true,
                                message: 'Please enter input value'
                            },
                            {...getDocumentNumberPattern(selectedType)}
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
                        label="Address"
                        name="adresse"
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

export default ClientFormModal;
