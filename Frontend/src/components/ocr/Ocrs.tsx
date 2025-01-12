import React from "react";
import {Button} from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";

const Ocrs = () => {
    return (
        <>
            <PageHeader
                title={'OCR'}
                extra={[
                    <Button size="large" icon={<FileSearchOutlined />}>
                        Process Ocr
                    </Button>,
                ]}
            />
        </>
    );
}
export default Ocrs;
