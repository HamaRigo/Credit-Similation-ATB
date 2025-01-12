import React from "react";
import { Button } from "antd";
import { IdcardOutlined } from "@ant-design/icons";
import { PageHeader } from "@ant-design/pro-layout";

const Users = () => {
    return (
        <>
            <PageHeader
                title={'Users'}
                extra={[
                    <Button size="large" icon={<IdcardOutlined />}>
                        Add user
                    </Button>,
                ]}
            />
        </>
    );
}
export default Users;
