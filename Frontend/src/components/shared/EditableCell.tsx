import React from "react";
import { Form, Input, InputNumber, Select, SelectProps, Switch } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
    editing: boolean;
    dataIndex: string;
    title: any;
    inputType: 'select' | 'selectMultiple' | 'money' | 'phone' | 'number' | 'text' | 'switch' | 'percent';
    dataType: any;
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
                                                                                dataType,
                                                                                showSearch,
                                                                                ...restProps
                                                                            }) => {

    const phonePattern = inputType == 'phone'
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

        case 'selectMultiple':
            inputNode = (
                <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    defaultValue={record.roles?.map(item => item.id)}
                    options={selectValues?.map((item) => (
                        { label: item.name, value: item.id }
                    ))}
                />
            );
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
                            message: `Please enter ${title} !`,
                        },
                        // type: 'number', min: 0, max: 99
                        // type: 'email'
                        dataType ? {
                            type: dataType,
                            message: `Please enter a valid ${dataType} !`,
                        } : null,
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