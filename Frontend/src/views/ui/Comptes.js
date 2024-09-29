import { Col, Row } from "reactstrap";
import React from "react";
import CompteList from "../../components/compte/CompteList";

const ClientTable = () => {
    return (
        <div>
            {/*** Table ***/}
            <Row>
                <Col lg="12">
                    <CompteList />
                </Col>
            </Row>
        </div>
    );
};

export default ClientTable;
