import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCompte, updateCompte } from '../../services/compteService';
import { getClients } from '../../services/ClientService';
import { getOcrs } from '../../services/ocrService';
import { getAllCredits } from '../../services/creditService';
import { toast } from 'react-toastify';
import '../style/CompteList.css';

const CompteDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        numeroCompte: '',
        solde: '',
        typeCompte: '',
        clientCin: '',
        ocrs: [],
        credits: []
    });
    const [clients, setClients] = useState([]);
    const [ocrs, setOcrs] = useState([]);
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [compteData, clientData, ocrData, creditData] = await Promise.all([
                    getCompte(id),
                    getClients(),
                    getOcrs(),
                    getAllCredits()
                ]);
                setFormData({
                    numeroCompte: compteData.data.numeroCompte,
                    solde: compteData.data.solde,
                    typeCompte: compteData.data.typeCompte,
                    clientCin: compteData.data.clientCin || '',
                    ocrs: compteData.data.ocrs.map(ocr => ocr.id) || [],
                    credits: compteData.data.credits.map(credit => credit.id) || []
                });
                setClients(clientData.data);
                setOcrs(ocrData.data);
                setCredits(creditData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Failed to fetch data.');
                toast.error('Failed to fetch data.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        } else {
            console.error('ID is undefined');
            setError('ID is missing.');
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMultiSelectChange = (e) => {
        const { name, options } = e.target;
        const selectedValues = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);

        setFormData((prev) => ({
            ...prev,
            [name]: selectedValues
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateCompte(id, formData);
            toast.success('Compte updated successfully!');
            navigate('/comptes');
        } catch (error) {
            console.error('Error updating compte:', error);
            setError('Failed to update compte.');
            toast.error('Failed to update compte.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="compte-detail-container">
            <h2>Update Compte</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Numero Compte:
                        <input
                            type="text"
                            name="numeroCompte"
                            value={formData.numeroCompte}
                            onChange={handleChange}
                            readOnly
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Solde:
                        <input
                            type="number"
                            name="solde"
                            value={formData.solde}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Type Compte:
                        <input
                            type="text"
                            name="typeCompte"
                            value={formData.typeCompte}
                            onChange={handleChange}
                        />
                    </label>
                </div>
                <div>
                    <label htmlFor="clientCin">Client CIN:</label>
                    <select
                        id="clientCin"
                        name="clientCin"
                        value={formData.clientCin}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Client CIN</option>
                        {clients.map(client => (
                            <option key={client.cin} value={client.cin}>
                                {client.cin}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="ocrs">OCRs:</label>
                    <select
                        id="ocrs"
                        name="ocrs"
                        multiple
                        value={formData.ocrs}
                        onChange={handleMultiSelectChange}
                    >
                        {ocrs.map(ocr => (
                            <option key={ocr.id} value={ocr.id}>
                                {ocr.id}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="credits">Credits:</label>
                    <select
                        id="credits"
                        name="credits"
                        multiple
                        value={formData.credits}
                        onChange={handleMultiSelectChange}
                    >
                        {credits.map(credit => (
                            <option key={credit.id} value={credit.id}>
                                {credit.id}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Save</button>
                <button type="button" onClick={() => navigate('/comptes')}>Cancel</button>
            </form>
        </div>
    );
};

export default CompteDetail;
