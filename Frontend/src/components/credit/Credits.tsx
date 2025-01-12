import React from "react";
import {Button} from "antd";
import { MoneyCollectOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";

const Credits = () => {
    return (
        <>
            <PageHeader
                title={'Credits'}
                extra={[
                    <Button size="large" icon={<MoneyCollectOutlined />}>
                        Add Credit
                    </Button>,
                ]}
            />
        </>
    );
}
export default Credits;