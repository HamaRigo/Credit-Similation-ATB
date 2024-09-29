import { Col, Row } from "reactstrap";
import React from "react";
import ClientList from "../../components/client/ClientList";

const ClientTable = () => {
    return (
        <div>
            {/*** Table ***/}
            <Row>
                <Col lg="12">
                    <ClientList />
                </Col>
            </Row>
        </div>
    );
};

export default ClientTable;
