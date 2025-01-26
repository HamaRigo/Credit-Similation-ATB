import { PageHeader } from "@ant-design/pro-layout";
import React, {useEffect, useState} from "react";
import { ClientType } from "../../types/ClientType";
import { Card, Descriptions, Space } from "antd";
import { useLocation } from "react-router-dom";
import { CompteType } from "../../types/CompteType";
import CompteList from "../compte/CompteList";
import CreditList from "../credit/CreditList";
import {CreditType} from "../../types/CreditType";

const ClientDetails = () => {
    const { state } = useLocation();
    //const param = useParams();
    const [client, setClient] = React.useState<ClientType>(null);
    const [comptes, setComptes] = React.useState<CompteType[]>(null);
    const [credits, setCredits] = React.useState<CreditType[]>(null);
    const [loading1, setLoading1] = useState<boolean>(true);
    const [loading2, setLoading2] = useState<boolean>(true);
    const [clients, setClients] = useState<ClientType[]>(null);

    const addComptesAndCredits = (client: ClientType) => {
        const data1 :CompteType[] = client.comptes?.map((item: CompteType) => (
            { ...item, client: client.id }
        ));
        const data2 :CompteType[] = client.credits?.map((item: CreditType) => (
            { ...item, client: client.id }
        ));
        setComptes(data1);
        setCredits(data2);
    }
    const getClient = (clientId: number) => {
        const selectedClient = state.clients?.find(item => item.id == clientId);
        setClient(selectedClient);
        addComptesAndCredits(selectedClient);
    };
    const getClients = () => {
        setClients(state.clients);
        setLoading1(false);
        setLoading2(false);
    };

    const updateClientFormValues = (formValues, editingType: string) => {
        if (editingType) {
            formValues.typeCompte = editingType;
        }
        formValues.client = {'id' : formValues.client};
        return formValues;
    }
    const updateCreditFormValues = (formValues) => {
        formValues.client = {'id' : formValues.client};
        return formValues;
    }

    useEffect(() => {
        if (state.client) {
            setClient(state.client);
            addComptesAndCredits(state.client);
        } else if (state.clientId) {
            getClient(state.clientId);
        }
        getClients();
    }, []);

    return (
        <>
            <PageHeader title={'Client Details'} />
            {client ?
                <>
                    <Space direction="vertical" size="middle" style={{display: 'flex', marginTop: 15}}>
                        <Card title='Client Info'>
                            <Descriptions>
                                <Descriptions.Item label="Full name">{client.prenom} {client.nom}</Descriptions.Item>
                                <Descriptions.Item label={"Document (" + client.typeDocument + ")"}>{client.numeroDocument}</Descriptions.Item>
                                <Descriptions.Item label="Phone">{client.telephone}</Descriptions.Item>
                                <Descriptions.Item label="Adresse">{client.adresse}</Descriptions.Item>
                                <Descriptions.Item label="Accounts">{client.compteCount}</Descriptions.Item>
                                <Descriptions.Item label="Credits">{client.creditCount}</Descriptions.Item>
                            </Descriptions>
                        </Card>
                        <Card title='Client Accounts'>
                            <CompteList
                                data={comptes}
                                setData={setComptes}
                                loading={loading1}
                                setLoading={setLoading1}
                                displayOnly={true}
                                updateFormValues={updateClientFormValues}
                                clients={clients}
                            />
                        </Card>

                        <Card title='Client Credits'>
                            <CreditList
                                data={credits}
                                setData={setCredits}
                                loading={loading2}
                                setLoading={setLoading2}
                                displayOnly={true}
                                updateFormValues={updateCreditFormValues}
                                clients={clients}
                            />
                        </Card>
                    </Space>
                </> : null}
        </>
    )
}

export default ClientDetails;