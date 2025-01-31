import React, { useEffect, useState } from "react";
import {Col, Row, Statistic, Card, Space} from "antd";
import {IdcardOutlined, MoneyCollectOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import {Doughnut, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import SalesChart from "./SalesChart";
import Feeds from "./Feeds";
import CompteService from "../../services/CompteService";
import ClientService from "../../services/ClientService";
import UserService from "../../services/UserService";
import RoleService from "../../services/RoleService";
import ErrorResult from "../shared/ErrorResult";
import CreditService from "../../services/CreditService";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [comptesByStatus, setComptesByStatus] = useState<{}>(null);
  const [comptesByType, setComptesByType] = useState<[]>(null);
  const [comptesByMonth, setComptesByMonth] = useState<[]>(null);
  const [clients, setClients] = useState<number>(null);
  const [users, setUsers] = useState<number>(null);
  const [credits, setCredits] = useState<number>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(null);
  const [rolesChartData, setRolesChartData] = useState(null);
  const [creditsChartData, setCreditsChartData] = useState(null);
  const options: any = {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2, // Adjust aspect ratio for a smaller chart
  }

  const getCountComptes = () => {
    CompteService.count_comptes_by_status()
        .then((response) => {
            if (response.data) {
                const activatedCount = response.data.find(item => item.activated)?.count ?? 0;
                const inactivatedCount = response.data.find(item => !item.activated)?.count ?? 0;
                const result = { 'active': activatedCount, 'inactive' : inactivatedCount }
                setComptesByStatus(result);
            }
        })
        .catch((error) => {
            setError(error);
        });

      CompteService.count_comptes_by_type()
          .then((response) => {
              setComptesByType(response.data);
          })
          .catch((error) => {
              setError(error);
          });

      CompteService.count_comptes_by_month('2025')
          .then((response) => {
              setComptesByMonth(response.data);
          })
          .catch((error) => {
              setError(error);
          });
  }
  const getCountClients = () => {
    ClientService.count_clients()
        .then((response) => {
          setClients(response.data);
        })
        .catch((error) => {
            setError(error);
        });
  }
  const getCountUsers = () => {
    UserService.count_users()
        .then((response) => {
            setUsers(response.data);
        })
        .catch((error) => {
            setError(error);
        });
  }
  const getRoles = () => {
    RoleService.list_roles()
        .then((response) => {
            const roles = response.data
            if (roles) {
                const chartData = {
                    labels: roles.map(item => item.name),
                    datasets: [{
                        label: 'Users Count',
                        data: roles.map(item => item.userCount),
                        backgroundColor: [
                            'rgb(186,15,15, 0.7)',
                            'rgba(13,46,83,0.7)',
                            'rgba(52,58,64,0.7)',
                            'rgba(136,149,158,0.7)',
                            'rgba(184,192,198,0.7)',
                        ],
                        borderWidth: 1,
                    }],
                };
                setRolesChartData(chartData);
            }

        })
        .catch((error) => {
            setError(error);
        });
  }
  const getCredits = () => {
    CreditService.count_credits_by_type()
        .then((response) => {
            const credits = response.data
            if (credits) {
                const labels: string[] = Object.keys(credits);
                const values: number[] = Object.values(credits);
                const total = values?.reduce((sum, item) => sum + item, 0)
                const chartData = {
                    labels: labels,
                    datasets: [{
                        label: 'Credits Count',
                        data: values,
                        backgroundColor: [
                            'rgba(184,192,198,0.7)',
                            'rgb(186,15,15, 0.7)',
                            'rgba(13,46,83,0.7)',
                            'rgba(136,149,158,0.7)',
                            'rgba(52,58,64,0.7)',
                            'rgb(218,173,13)',
                            'rgb(12,105,170)',
                        ],
                        hoverOffset: 4
                        //borderWidth: 1,
                    }],
                };
                setCreditsChartData(chartData);
                setCredits(total);
            }
        })
        .catch((error) => {
            setError(error);
        })
        .finally(() => {
            setIsLoading(false);
        });
  }

  useEffect(() => {
      //Runs only on the first render
      getCountComptes();
      getCountClients();
      getCountUsers();
      getRoles();
      getCredits();
  }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }

    if (isLoading) {
        return;
    }

    return (
        <Space direction="vertical" size="middle" style={{display: 'flex'}}>
            <Row gutter={16}>
                {comptesByStatus ? <Col span={comptesByType?.length > 0 ? 6 : 12}>
                    <Card bordered={false}>
                        <Statistic
                            title={"Active Accounts".toUpperCase()}
                            value={comptesByStatus['active']}
                            valueStyle={{color: '#3f8600'}}
                        />
                    </Card>
                </Col> : null}
                {comptesByStatus ? <Col span={comptesByType?.length > 0 ? 6 : 12}>
                    <Card bordered={false}>
                      <Statistic
                          title={"Inactive Accounts".toUpperCase()}
                          value={comptesByStatus['inactive']}
                          valueStyle={{ color: '#cfa913' }}
                      />
                    </Card>
                </Col> : null}
                {comptesByType?.map((item: any) => (<Col span={6}>
                    <Card bordered={false}>
                        <Statistic
                            title={item.typeCompte.toUpperCase() + " ACCOUNTS"}
                            value={item.count}
                        />
                    </Card>
                </Col>))}
            </Row>
            <Row justify="space-around" align="middle" gutter={16}>
                <Col span={12}>
                    <Space direction="vertical" size="middle" style={{display: 'flex'}}>
                        {clients != null ? <Card bordered={false}>
                                <Statistic
                                    title={"Clients".toUpperCase()}
                                    value={clients}
                                    prefix={<UsergroupAddOutlined />}
                                    valueStyle={{ color: '#191b8f' }}
                                />
                            </Card>: null}
                        {users != null ? <Card bordered={false}>
                                <Statistic
                                    title={"Users".toUpperCase()}
                                    value={users}
                                    prefix={<IdcardOutlined />}
                                    valueStyle={{ color: 'darkgrey' }}
                                />
                            </Card> : null}
                        {credits != null ? <Card bordered={false}>
                            <Statistic
                                title={"Credits".toUpperCase()}
                                value={credits}
                                prefix={<MoneyCollectOutlined />}
                                valueStyle={{ color: 'darkred' }}
                            />
                        </Card> : null}
                    </Space>
                </Col>
                <Col span={12}><Feeds /></Col>
            </Row>
            {comptesByMonth ? <SalesChart data={comptesByMonth} /> : null }
            <Row justify="space-around" align="middle" gutter={12}>
                {creditsChartData ? <Col span={12}>
                    <Card title={"Credits Distribution"}>
                        <Doughnut
                            data={creditsChartData}
                            options={options}
                        />
                    </Card>
                </Col>: null}
                {rolesChartData ? <Col span={12}>
                    <Card title={"Users Distribution"}>
                        <Pie
                            data={rolesChartData}
                            options={options}
                        />
                    </Card>
                </Col> : null}
            </Row>
        </Space>
    );
};

export default Dashboard;
