import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ClientService from '../../services/ClientService';
import { ClientType } from "../../types/ClientType";

const ClientList = React.memo(() => {
    const [clients, setClients] = useState<ClientType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [selectedClients, setSelectedClients] = useState<string[]>([]);
    const [allSelected, setAllSelected] = useState<boolean>(false); // Track if all clients are selected

    const [editClientId, setEditClientId] = useState<string>('');
    const [editField, setEditField] = useState(null);

    const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

    useEffect(() => {
        //Runs only on the first render
        getClients();
    }, []);

    // List all clients
    const getClients = () => {
        setLoading(true);
        ClientService.list_clients()
            .then((response: any) => {
                if (response.data) {
                    setClients(response.data);
                    // Reset selection state when clients are loaded
                    setAllSelected(false);
                    setSelectedClients([]);
                }
            })
            .catch((error: any) => {
                console.log(error);
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Add client
    const handleAddClient = () => {
        navigate('/Clients/add');
    };

    // Edit client
    const handleEditClick = (client: ClientType) => {
        setEditClientId(client.numeroDocument);
        //setTempData({ ...row });
    };
    const handleSave = async () => {
        /*const clientToUpdate:any = clients.find(client => client.numeroDocument === editClientId);
        try {
            await ClientService.edit_client(clientToUpdate, editClientId); // Pass the updated URL to the updateClient function
            setEditClientId(''); // Exit editing mode after save
            setEditField(null);
            setClients(clients.map(client =>
            client.numeroDocument === id ? { ...client, [field]: value } : client
        ));
        } catch (error: any) {
            setError(error.message);
        }*/
        setEditClientId('');
        //setTempData(null);
    };
    const handleCancel = () => {
        setEditClientId('');
        //setTempData(null);
    };

    // Select client(s)
    const handleSelectClient = (id: string) => {
        setSelectedClients(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(clientId => clientId !== id)
                : [...prevSelected, id]
        );
    };
    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedClients([]);
            setAllSelected(false);
        } else {
            setSelectedClients(clients.map(client => client.numeroDocument));
            setAllSelected(true);
        }
    };

    // Delete client(s)
    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedClients.map(id => ClientService.delete_client(id)));
            setClients(clients.filter(client => !selectedClients.includes(client.numeroDocument)));
            setSelectedClients([]); // Clear selected clients after deletion
            setAllSelected(false); // Reset allSelected state
        } catch (error: any) {
            setError(error.message);
        }
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between mb-3">
                <button className="btn btn-primary" onClick={handleAddClient}>Add Client</button>
                <div className="d-flex">
                    <button className="btn btn-primary me-2" onClick={handleSelectAll}>{allSelected ? 'Unselect All' : 'Select All'}</button>
                    <button className="btn btn-danger" onClick={handleDeleteSelected}>Delete Selected</button>
                </div>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th></th>
                    <th>Firstname</th>
                    <th>Lastname</th>
                    <th>Document type</th>
                    <th>Document number</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {clients.map(client => (
                    <tr key={client.numeroDocument}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedClients.includes(client.numeroDocument)}
                                onChange={() => handleSelectClient(client.numeroDocument)}
                            />
                        </td>
                        <td>
                            {editClientId === client.numeroDocument ? (
                                <input
                                    style={{width: "100%"}}
                                    type="text"
                                    value={client.prenom}
                                />
                            ) : (
                                client.prenom
                            )}
                        </td>
                        <td>
                            {editClientId === client.numeroDocument ? (
                                <input
                                    style={{width: "100%"}}
                                    type="text"
                                    value={client.nom}
                                />
                            ) : (
                                client.nom
                            )}
                        </td>
                        <td>
                            {editClientId === client.numeroDocument ? (
                                <input
                                    style={{width: "100%"}}
                                    type="text"
                                    value={client.typeDocument}
                                />
                            ) : (
                                client.typeDocument
                            )}
                        </td>
                        <td>
                            {editClientId === client.numeroDocument ? (
                                <input
                                    style={{width: "100%"}}
                                    type="text"
                                    value={client.numeroDocument}
                                />
                            ) : (
                                client.numeroDocument
                            )}
                        </td>
                        <td>
                            {editClientId === client.numeroDocument ? (
                                <input
                                    style={{width: "100%"}}
                                    type="text"
                                    value={client.adresse}
                                />
                            ) : (
                                client.adresse
                            )}
                        </td>
                        <td>
                            {editClientId === client.numeroDocument ? (
                                <input
                                    style={{width: "100%"}}
                                    type="text"
                                    value={client.telephone}
                                />
                            ) : (
                                client.telephone
                            )}
                        </td>
                        <td>
                            {editClientId === client.numeroDocument ? (
                                <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                                    <i className="bi bi-check-circle" style={{ color: "green" }} onClick={handleSave}></i>
                                    <i className="bi bi-x-circle" style={{ color: "red" }} onClick={handleCancel}></i>
                                </div>
                            ) : (
                                <i className='bi bi-pencil' onClick={() => handleEditClick(client)}></i>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
});

export default ClientList;
