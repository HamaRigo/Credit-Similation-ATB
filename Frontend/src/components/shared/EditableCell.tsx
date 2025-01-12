import React from "react";
import { Form, Input, InputNumber, Select, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'select' | 'money' | 'phone' | 'number' | 'text' | 'switch' | 'percent';
    record: any;
    index: number;
    selectValues : any;
    showSearch: boolean;
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
                                                                                showSearch,
                                                                                ...restProps
                                                                            }) => {

    const phonePattern = dataIndex == 'telephone'
    let inputNode;
    switch (inputType) {
        case 'number':
            inputNode = <InputNumber />;
            break;

        case 'money':
            inputNode = (
                <InputNumber
                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number}
                />
            );
            break;

        case 'percent':
            inputNode = (
               <InputNumber<number>
                    min={0}
                    max={100}
                    formatter={(value) => `${value} %`}
                    parser={(value) => value?.replace('%', '') as unknown as number}
                />
            );
            break;

        case 'switch':
            inputNode = (
                <Switch
                    checkedChildren={<CheckOutlined />}
                    unCheckedChildren={<CloseOutlined />}
                    defaultChecked={record?.activated}
                />
            );
            break;

        case 'phone':
            inputNode = <Input showCount maxLength={8} />;
            break;

        case 'select':
            inputNode = (
                <Select showSearch={showSearch}>
                    {selectValues?.map((item) => {
                        if (dataIndex == 'client') {
                            return <Select.Option key={item.id} value={item.id}>{item.numeroDocument}</Select.Option>
                        }
                        return <Select.Option key={item} value={item}>{item}</Select.Option>
                    })}
                </Select>
            );
            break;

        default:
            inputNode = <Input />;
            break;
    }

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