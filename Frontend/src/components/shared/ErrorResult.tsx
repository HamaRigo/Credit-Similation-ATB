import {Button, Result} from "antd";
import React from "react";

type Props = {
    error?: any;
};

const ErrorResult = (props: Props) => {
    return <Result
        status={props.error.response?.status ?? '404'}
        title="Error"
        subTitle={props.error.message}
        extra={
            <Button type="primary" onClick={() => window.location.reload()}>
                Refresh
            </Button>
        }
    />
}

export default ErrorResult;