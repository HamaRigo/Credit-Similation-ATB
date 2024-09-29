import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import { getComptes, deleteCompte, updateCompte } from '../../services/compteService';

// Import all avatars from the assets/images/users directory
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";
import defaultAvatar from "../../assets/images/users/user3.jpg"; // Optional: for a default avatar

const avatars = [user1, user2, user3, user4, user5]; // Add more avatars as needed

const CompteList = React.memo(() => {
    const [comptes, setComptes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editCompteId, setEditCompteId] = useState(null);
    const [editField, setEditField] = useState(null);
    const [selectedComptes, setSelectedComptes] = useState([]);
    const [allSelected, setAllSelected] = useState(false); // Track if all comptes are selected
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const result = await getComptes();
                const comptesWithAvatars = result.data.map(compte => ({
                    ...compte,
                    avatar: avatars[Math.floor(Math.random() * avatars.length)]
                }));
                setComptes(comptesWithAvatars);
                // Reset selection state when comptes are loaded
                setAllSelected(false);
                setSelectedComptes([]);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const handleDelete = async (numeroCompte) => {
        try {
            await deleteCompte(numeroCompte);
            setComptes(comptes.filter(compte => compte.numeroCompte !== numeroCompte));
            // Update selected comptes if the deleted compte was selected
            setSelectedComptes(selectedComptes.filter(selectedNumeroCompte => selectedNumeroCompte !== numeroCompte));
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedComptes.map(numeroCompte => deleteCompte(numeroCompte)));
            setComptes(comptes.filter(compte => !selectedComptes.includes(compte.numeroCompte)));
            setSelectedComptes([]); // Clear selected comptes after deletion
            setAllSelected(false); // Reset allSelected state
        } catch (error) {
            setError(error.message);
        }
    };

    const handleInputChange = (numeroCompte, field, value) => {
        setComptes(comptes.map(compte =>
            compte.numeroCompte === numeroCompte ? { ...compte, [field]: value } : compte
        ));
    };

    const handleCellClick = (numeroCompte, field) => {
        if (editCompteId === numeroCompte && editField === field) {
            setEditCompteId(null); // Exit edit mode if the same cell is clicked again
            setEditField(null);
        } else {
            setEditCompteId(numeroCompte);
            setEditField(field);
        }
    };

    const handleSave = async () => {
        const compteToUpdate = comptes.find(compte => compte.numeroCompte === editCompteId);
        try {
            const url = `/compte/${editCompteId}`; // Updated URL format
            await updateCompte(url, compteToUpdate); // Pass the updated URL to the updateCompte function
            setEditCompteId(null); // Exit editing mode after save
            setEditField(null);
        } catch (error) {
            setError(error.message);
        }
    };

    const handleSelectCompte = (numeroCompte) => {
        setSelectedComptes(prevSelected =>
            prevSelected.includes(numeroCompte)
                ? prevSelected.filter(compteNumero => compteNumero !== numeroCompte)
                : [...prevSelected, numeroCompte]
        );
    };

    const handleSelectAll = () => {
        if (allSelected) {
            setSelectedComptes([]);
            setAllSelected(false);
        } else {
            setSelectedComptes(comptes.map(compte => compte.numeroCompte));
            setAllSelected(true);
        }
    };

    const navigateToAddCompte = () => {
        navigate('/comptes/add'); // Redirects to the Add Compte form
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
                <button className="btn btn-primary" onClick={navigateToAddCompte}>Add Compte</button>
                <div className="d-flex">
                    <button className="btn btn-primary me-2" onClick={handleSelectAll}>
                        {allSelected ? 'Unselect All' : 'Select All'}
                    </button>
                    <button className="btn btn-danger" onClick={handleDeleteSelected}>Delete Selected</button>
                </div>
            </div>
            <Table className="no-wrap mt-3 align-middle" responsive borderless>
                <thead>
                <tr>
                    <th>Select</th>
                    <th>Client</th>
                    <th>Numero Compte</th>
                    <th>Solde</th>
                    <th>Type Compte</th>
                    <th>OCRs</th>
                    <th>Credits</th>
                </tr>
                </thead>
                <tbody>
                {comptes.map(compte => (
                    <tr key={compte.numeroCompte} className="border-top">
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedComptes.includes(compte.numeroCompte)}
                                onChange={() => handleSelectCompte(compte.numeroCompte)}
                            />
                        </td>
                        <td>
                            <div className="d-flex align-items-center p-2">
                                <img
                                    src={compte.avatar || defaultAvatar}
                                    className="rounded-circle"
                                    alt="avatar"
                                    width="45"
                                    height="45"
                                />
                                <div className="ms-3">
                                    {editCompteId === compte.numeroCompte ? (
                                        <input
                                            type="text"
                                            value={compte.clientCin}
                                            onChange={(e) => handleInputChange(compte.numeroCompte, 'clientCin', e.target.value)}
                                            onBlur={() => handleCellClick(compte.numeroCompte, 'clientCin')}
                                            autoFocus
                                        />
                                    ) : (
                                        <h6 className="mb-0" onClick={() => handleCellClick(compte.numeroCompte, 'clientCin')}>
                                            {compte.clientCin}
                                        </h6>
                                    )}
                                </div>
                            </div>
                        </td>
                        <td onClick={() => handleCellClick(compte.numeroCompte, 'numeroCompte')}>
                            {editCompteId === compte.numeroCompte ? (
                                <input
                                    type="text"
                                    value={compte.numeroCompte}
                                    onChange={(e) => handleInputChange(compte.numeroCompte, 'numeroCompte', e.target.value)}
                                    onBlur={() => handleCellClick(compte.numeroCompte, 'numeroCompte')}
                                    autoFocus
                                />
                            ) : (
                                compte.numeroCompte
                            )}
                        </td>
                        <td onClick={() => handleCellClick(compte.numeroCompte, 'solde')}>
                            {editCompteId === compte.numeroCompte ? (
                                <input
                                    type="text"
                                    value={compte.solde}
                                    onChange={(e) => handleInputChange(compte.numeroCompte, 'solde', e.target.value)}
                                    onBlur={() => handleCellClick(compte.numeroCompte, 'solde')}
                                />
                            ) : (
                                compte.solde
                            )}
                        </td>
                        <td onClick={() => handleCellClick(compte.numeroCompte, 'typeCompte')}>
                            {editCompteId === compte.numeroCompte ? (
                                <input
                                    type="text"
                                    value={compte.typeCompte}
                                    onChange={(e) => handleInputChange(compte.numeroCompte, 'typeCompte', e.target.value)}
                                    onBlur={() => handleCellClick(compte.numeroCompte, 'typeCompte')}
                                />
                            ) : (
                                compte.typeCompte
                            )}
                        </td>
                        <td onClick={() => handleCellClick(compte.numeroCompte, 'ocrs')}>
                            {editCompteId === compte.numeroCompte ? (
                                <input
                                    type="text"
                                    value={compte.ocrs ? compte.ocrs.join(', ') : ''}
                                    onChange={(e) => handleInputChange(compte.numeroCompte, 'ocrs', e.target.value.split(', '))}
                                    onBlur={() => handleCellClick(compte.numeroCompte, 'ocrs')}
                                />
                            ) : (
                                (compte.ocrs || []).join(', ')
                            )}
                        </td>
                        <td onClick={() => handleCellClick(compte.numeroCompte, 'credits')}>
                            {editCompteId === compte.numeroCompte ? (
                                <input
                                    type="text"
                                    value={compte.credits ? compte.credits.join(', ') : ''}
                                    onChange={(e) => handleInputChange(compte.numeroCompte, 'credits', e.target.value.split(', '))}
                                    onBlur={() => handleCellClick(compte.numeroCompte, 'credits')}
                                />
                            ) : (
                                (compte.credits || []).join(', ')
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
            {editCompteId && (
                <button className="btn btn-success" onClick={handleSave}>Save Changes</button>
            )}
        </div>
    );
});

export default CompteList;
