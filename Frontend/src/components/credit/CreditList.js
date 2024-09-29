import React, { useEffect, useState } from 'react';
import { getAllCredits, deleteCredit, updateCredit } from '../../services/creditService';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const CreditList = () => {
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await getAllCredits();
                setCredits(response.data);
            } catch (error) {
                console.error('Error fetching credits:', error);
                setError('Failed to fetch credits.');
                toast.error('Failed to fetch credits.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteCredit(id);
            setCredits(credits.filter((credit) => credit.id !== id));
            toast.success('Credit deleted successfully!');
        } catch (error) {
            console.error('Error deleting credit:', error);
            toast.error('Failed to delete credit.');
        }
    };

    const handleUpdate = async (id) => {
        try {
            const updatedCredit = { ...credits.find((credit) => credit.id === id) }; // Define updatedCredit here
            // Make necessary changes to updatedCredit here
            await updateCredit(id, updatedCredit);
            setCredits(
                credits.map((credit) => (credit.id === id ? updatedCredit : credit))
            );
            toast.success('Credit updated successfully!');
        } catch (error) {
            console.error('Error updating credit:', error);
            toast.error('Failed to update credit.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="credit-list-container">
            <h2>Credit List</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Montant</th>
                    <th>Taux Interet</th>
                    <th>Duree</th>
                    <th>Statut</th>
                    <th>Numero Compte</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {credits.map((credit) => (
                    <tr key={credit.id}>
                        <td>{credit.id}</td>
                        <td>{credit.montant}</td>
                        <td>{credit.tauxInteret}</td>
                        <td>{credit.duree}</td>
                        <td>{credit.statut}</td>
                        <td>{credit.numeroCompte}</td>
                        <td>
                            <button onClick={() => handleUpdate(credit.id)}>Edit</button>
                            <button onClick={() => handleDelete(credit.id)}>Delete</button>
                            <Link to={`/credits/${credit.id}`}>View</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default CreditList;
