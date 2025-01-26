import React, { useEffect, useState } from "react";
import { Col, Row, Statistic, Card, Space, Spin, Divider } from "antd";
import { IdcardOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import SalesChart from "./SalesChart";
import Feeds from "./Feeds";
import CompteService from "../../services/CompteService";
import ClientService from "../../services/ClientService";
import UserService from "../../services/UserService";
import RoleService from "../../services/RoleService";
import {RoleType} from "../../types/RoleType";
import ErrorResult from "../shared/ErrorResult";

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [comptesByStatus, setComptesByStatus] = useState<{}>(null);
  const [comptesByType, setComptesByType] = useState<[]>(null);
  const [clients, setClients] = useState<number>(null);
  const [users, setUsers] = useState<number>(null);
  const [roles, setRoles] = useState<RoleType[]>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>(null);
  const [rolesChartData, setRolesChartData] = useState(null);

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
            const result = response.data
            if (result) {
                setRoles(result);
                const chartData = {
                    labels: result.map(item => item.name),
                    datasets: [{
                        data: result.map(item => item.userCount),
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
  }, []);

    if (error) {
        return <ErrorResult error={error} />;
    }

    // @ts-ignore
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
                    {clients != null ? <Card bordered={false}>
                            <Statistic
                                title={"Clients".toUpperCase()}
                                value={clients}
                                prefix={<UsergroupAddOutlined />}
                                valueStyle={{ color: '#191b8f' }}
                            />
                        </Card>: null}
                    <Divider />
                    {users != null ? <Card bordered={false}>
                            <Statistic
                                title={"Users".toUpperCase()}
                                value={users}
                                prefix={<IdcardOutlined />}
                                valueStyle={{ color: 'darkgrey' }}
                            />
                        </Card> : null}
                </Col>
                <Col span={12}><Feeds /></Col>
            </Row>
            <Row justify="space-around" align="middle" gutter={16}>
              <Col span={16}>
                <SalesChart />
              </Col>
                {rolesChartData ? <Col span={8}>
                    <Pie data={rolesChartData} />
                </Col> : null}
            </Row>
      </Space>
  );
};

export default Dashboard;
