import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ajout de l'importation de useNavigate
import { deleteClient, getClients, updateClient } from '../../services/clientService';

// Import all avatars from the assets/images/users directory
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";
import defaultAvatar from "../../assets/images/users/user3.jpg"; // Optional: for a default avatar

const avatars = [user1, user2, user3, user4, user5]; // Add more avatars as needed

const ClientList = React.memo(() => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editClientId, setEditClientId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [selectedClients, setSelectedClients] = useState([]);
    const [allSelected, setAllSelected] = useState(false); // Track if all clients are selected

    const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation

    useEffect(() => {
        (async () => {
            try {
                const result = await getClients();
                const clientsWithAvatars = result.data.map(client => ({
                    ...client,
                    avatar: avatars[Math.floor(Math.random() * avatars.length)],
                    isEditing: false // Add editing state
                }));
                setClients(clientsWithAvatars);
                // Reset selection state when clients are loaded
                setAllSelected(false);
                setSelectedClients([]);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDelete = async (cin) => {
        try {
            await deleteClient(cin);
            setClients(clients.filter(client => client.cin !== cin));
            // Update selected clients if the deleted client was selected
            setSelectedClients(selectedClients.filter(selectedCin => selectedCin !== cin));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (cin, field, value) => {
        setClients(clients.map(client =>
            client.cin === cin ? { ...client, [field]: value } : client
        ));
    };

    const handleCellClick = (cin, field) => {
        if (editClientId === cin && editField === field) {
            setEditClientId(null); // Exit edit mode if the same cell is clicked again
            setEditField(null);
        } else {
            setEditClientId(cin);
            setEditField(field);
        }
    };

    const handleSave = async () => {
        const clientToUpdate = clients.find(client => client.cin === editClientId);
        try {
            const url = `/client/${editClientId}`; // Updated URL format
            await updateClient(url, clientToUpdate); // Pass the updated URL to the updateClient function
            setEditClientId(null); // Exit editing mode after save
            setEditField(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSelectClient = (cin) => {
        setSelectedClients(prevSelected =>
            prevSelected.includes(cin)
                ? prevSelected.filter(clientCin => clientCin !== cin)
                : [...prevSelected, cin]
        );
    };

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedClients([]);
            setAllSelected(false);
        } else {
            setSelectedClients(clients.map(client => client.cin));
            setAllSelected(true);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedClients.map(cin => deleteClient(cin)));
            setClients(clients.filter(client => !selectedClients.includes(client.cin)));
            setSelectedClients([]); // Clear selected clients after deletion
            setAllSelected(false); // Reset allSelected state
        } catch (error) {
            setError(error.message);
        }
    };

    const handleAddClient = () => {
        navigate('/Clients/add'); // Utilisation de navigate pour changer de route
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
                <h2 className="text-center mb-3">Clients</h2>
                <div className="d-flex">
                    <button className="btn btn-primary me-2" onClick={handleSelectAll}>{allSelected ? 'Unselect All' : 'Select All'}</button>
                    <button className="btn btn-danger" onClick={handleDeleteSelected}>Delete Selected</button>
                </div>
            </div>
            <table className="table">
                <thead>
                <tr>
                    <th>Select</th>
                    <th>Client</th>
                    <th>CIN</th>
                    <th>Nom</th>
                    <th>Prenom</th>
                    <th>Adresse</th>
                    <th>Numéro de Téléphone</th>
                </tr>
                </thead>
                <tbody>
                {clients.map(client => (
                    <tr key={client.cin}>
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedClients.includes(client.cin)}
                                onChange={() => handleSelectClient(client.cin)}
                            />
                        </td>
                        <td>
                            <div className="d-flex align-items-center p-2">
                                <img
                                    src={client.avatar || defaultAvatar}
                                    className="rounded-circle"
                                    alt="avatar"
                                    width="45"
                                    height="45"
                                />
                                <div className="ms-3">
                                    {editClientId === client.cin ? (
                                        <>
                                            <input
                                                type="text"
                                                value={client.nom}
                                                onChange={(e) => handleInputChange(client.cin, 'nom', e.target.value)}
                                                onBlur={() => handleCellClick(client.cin, 'nom')}
                                                autoFocus
                                            />
                                            <input
                                                type="text"
                                                value={client.prenom}
                                                onChange={(e) => handleInputChange(client.cin, 'prenom', e.target.value)}
                                                onBlur={() => handleCellClick(client.cin, 'prenom')}
                                            />
                                        </>
                                    ) : (
                                        <h6 className="mb-0" onClick={() => handleCellClick(client.cin, 'nom')}>
                                            {client.nom} {client.prenom}
                                        </h6>
                                    )}
                                    <span className="text-muted">CIN: {client.cin}</span>
                                </div>
                            </div>
                        </td>
                        <td onClick={() => handleCellClick(client.cin, 'cin')}>
                            {editClientId === client.cin ? (
                                <input
                                    type="text"
                                    value={client.cin}
                                    onChange={(e) => handleInputChange(client.cin, 'cin', e.target.value)}
                                    onBlur={() => handleCellClick(client.cin, 'cin')}
                                    autoFocus
                                />
                            ) : (
                                client.cin
                            )}
                        </td>
                        <td onClick={() => handleCellClick(client.cin, 'nom')}>
                            {editClientId === client.cin ? (
                                <input
                                    type="text"
                                    value={client.nom}
                                    onChange={(e) => handleInputChange(client.cin, 'nom', e.target.value)}
                                    onBlur={() => handleCellClick(client.cin, 'nom')}
                                />
                            ) : (
                                client.nom
                            )}
                        </td>
                        <td onClick={() => handleCellClick(client.cin, 'prenom')}>
                            {editClientId === client.cin ? (
                                <input
                                    type="text"
                                    value={client.prenom}
                                    onChange={(e) => handleInputChange(client.cin, 'prenom', e.target.value)}
                                    onBlur={() => handleCellClick(client.cin, 'prenom')}
                                />
                            ) : (
                                client.prenom
                            )}
                        </td>
                        <td onClick={() => handleCellClick(client.cin, 'adresse')}>
                            {editClientId === client.cin ? (
                                <input
                                    type="text"
                                    value={client.adresse}
                                    onChange={(e) => handleInputChange(client.cin, 'adresse', e.target.value)}
                                    onBlur={() => handleCellClick(client.cin, 'adresse')}
                                />
                            ) : (
                                client.adresse
                            )}
                        </td>
                        <td onClick={() => handleCellClick(client.cin, 'numeroTelephone')}>
                            {editClientId === client.cin ? (
                                <input
                                    type="text"
                                    value={client.numeroTelephone}
                                    onChange={(e) => handleInputChange(client.cin, 'numeroTelephone', e.target.value)}
                                    onBlur={() => handleCellClick(client.cin, 'numeroTelephone')}
                                />
                            ) : (
                                client.numeroTelephone
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
