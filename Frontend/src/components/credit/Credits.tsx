import React, {useEffect, useState} from 'react';

import {Button} from 'antd';

import {FundProjectionScreenOutlined, MoneyCollectOutlined} from "@ant-design/icons";
import Notifications from "../shared/Notifications";
import { FormInstance } from "antd/lib/form";
import ErrorResult from "../shared/ErrorResult";
import { PageHeader } from "@ant-design/pro-layout";
import { TypeCreditEnum } from "../../types/TypeCreditEnum";
import { StatusCreditEnum } from "../../types/StatusCreditEnum";
import { CreditType } from "../../types/CreditType";
import { ClientType } from "../../types/ClientType";
import ClientService from "../../services/ClientService";
import CreditService from "../../services/CreditService";
import CreditFormModal from "./CreditFormModal";
import CreditSimulationModal from "./CreditSimulationModal";
import CreditList from "./CreditList";

const creditTypes = Object.values(TypeCreditEnum);
const creditPeriods = Array.from({ length: 20 }, (_, index) => index + 1);

const Credits = () => {
    const [data, setData] = useState<CreditType[]>(null);
    const [clients, setClients] = useState<ClientType[]>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
    let addForm: FormInstance = null;
    const [errorsAdd, setErrorsAdd] = React.useState<string>('');

    // actions
    const getCredits = () => {
        setLoading(true);
        CreditService.list_credits()
            .then((response) => {
                if (response.data) {
                    const data :CreditType[] = response.data?.map((item: CreditType) => (
                        { ...item, client: item.client.id }
                    ));
                    setData(data);
                }
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const getClients = () => {
        ClientService.list_clients()
            .then((response) => {
                if (response.data) {
                    setClients(response.data);
                }
            });
    };
    const toggleAdd = () => {
        setErrorsAdd('');
        setIsModalOpen(true);
    }
    const handleAdd = async (values) => {
        const formValues = updateFormValues(values);
        formValues.status = StatusCreditEnum.PENDING;
        setErrorsAdd('');
        CreditService.add_credit(formValues)
            .then((response) => {
                setLoading(true);
                setIsModalOpen(false);
                const newRowData: CreditType = response.data;
                newRowData.client = newRowData.client.id;
                Notifications.openNotificationWithIcon('success', 'Credit added successfully !');
                //delete data of form
                addForm?.resetFields();
                //add data to table
                setLoading(false);
                setData([...data, newRowData]);
            })
            .catch((error) => {
                setErrorsAdd(error.message);
            });
    };
    const cancelAdd = () => {
        addForm?.resetFields();
        setIsModalOpen(false);
    }
    const updateFormValues = (formValues) => {
        formValues.client = {'id' : formValues.client};
        return formValues;
    }
    const toggleSimulation = () => {
        setIsSimulationModalOpen(true);
    }

    useEffect(() => {
        //Runs only on the first render
        getCredits();
        getClients();
    }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }
    
    return (
        <>
            <PageHeader
                title={'Credits'}
                extra={[
                    <Button size="large" type='link' icon={<FundProjectionScreenOutlined />} onClick={toggleSimulation}>
                        Credit Simulation
                    </Button>,
                    <Button size="large" icon={<MoneyCollectOutlined />} onClick={toggleAdd}>
                        Add Credit
                    </Button>,
                ]}
            />
            <CreditFormModal
                modalForm={addForm}
                isModalOpen={isModalOpen}
                clients={clients}
                creditPeriods={creditPeriods}
                creditTypes={creditTypes}
                errorsModal={errorsAdd}
                onSave={handleAdd}
                onCancel={cancelAdd}
            />
            <CreditSimulationModal
                idModalOpen={isSimulationModalOpen}
                setIsModalOpen={setIsSimulationModalOpen}
            />
            <CreditList
                data={data}
                setData={setData}
                clients={clients}
                loading={loading}
                setLoading={setLoading}
                updateFormValues={updateFormValues}
            />
        </>
    );
}
export default Credits;