import React, { useEffect, useState } from 'react';

import {Button} from 'antd';

import { CompteType } from "../../types/CompteType";
import {WalletOutlined} from "@ant-design/icons";
import ErrorResult from "../shared/ErrorResult";
import CompteService from "../../services/CompteService";
import ClientService from "../../services/ClientService";
import { ClientType } from "../../types/ClientType";
import { PageHeader } from "@ant-design/pro-layout";
import CompteList from './CompteList';
import CompteFormModal from "./CompteFormModal";

const Comptes = () => {
    const [data, setData] = useState<CompteType[]>(null);
    const [clients, setClients] = useState<ClientType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorsAdd, setErrorsAdd] = React.useState<string>('');

    // actions
    const getComptes = () => {
        CompteService.list_comptes()
            .then((response) => {
                if (response.data) {
                    const data :CompteType[] = response.data?.map((item: CompteType) => (
                        { ...item, client: item.client.id }
                    ));
                    setData(data);
                }
            })
            .catch((error) => {
                setError(error);
            })
    };
    const getClients = () => {
        ClientService.list_clients()
            .then((response) => {
                if (response.data) {
                    setClients(response.data);
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const toggleAdd = () => {
        setErrorsAdd('');
        setIsModalOpen(true);
    }
    const updateFormValues = (formValues, editingType: string) => {
        if (editingType) {
            formValues.typeCompte = editingType;
        }
        formValues.client = {'id' : formValues.client};
        return formValues;
    }

    useEffect(() => {
        //Runs only on the first render
        getComptes();
        getClients();
    }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }

    return (
        <>
            <PageHeader
                title={'Accounts'}
                extra={[
                    <Button size="large" icon={<WalletOutlined />} onClick={toggleAdd}>
                        Add Account
                    </Button>,
                ]}
            />
            <CompteFormModal
                data={data}
                setData={setData}
                setLoading={setLoading}
                clients={clients}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                errorsAdd={errorsAdd}
                setErrorsAdd={setErrorsAdd}
                updateFormValues={updateFormValues}
            />
            <CompteList
                data={data}
                setData={setData}
                loading={loading}
                setLoading={setLoading}
                clients={clients}
                updateFormValues={updateFormValues}
            />
        </>
    );
};

export default Comptes;
