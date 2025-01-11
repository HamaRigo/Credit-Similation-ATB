import React from "react";
import {Form, Input, InputNumber, Select} from "antd";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'select' | 'number' | 'text';
    record: Object;
    index: number;
    selectValues : string[];
}
const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
                                                                                editing,
                                                                                dataIndex,
                                                                                title,
                                                                                inputType,
                                                                                record,
                                                                                index,
                                                                                children,
                                                                                selectValues,
                                                                                ...restProps
                                                                            }) => {

    const phonePattern = dataIndex == 'telephone'
    const inputNode = inputType === 'number' ?
        <InputNumber /> : inputType === 'select' ?
            <Select>
                {selectValues.map(item => <Select.Option value={item}>{item}</Select.Option>)}
            </Select>
            : phonePattern ?
                <Input showCount maxLength={8} /> : <Input />;

    return (
        <td {...restProps}>
            {editing ? (
                <Form.Item
                    name={dataIndex}
                    style={{ margin: 0 }}
                    rules={[
                        {
                            required: true,
                            message: `Please enter ${title}!`,
                        },
                        phonePattern ? { pattern: /^\d{8}$/, message: `${title} must be exactly 8 digits!` } : null,
                    ]}
                >
                    {inputNode}
                </Form.Item>
            ) : (
                children
            )}
        </td>
    );
};

export default EditableCell;