import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteClient, getClient, updateClient } from "../../services/ClientService";

const ClientDetail = () => {
    const { cin } = useParams();
    const navigate = useNavigate();
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const result = await getClient(cin);
                setClient(result.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        })();
    }, [cin]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setClient({ ...client, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateClient(cin, client);
            navigate('/clients');
        } catch (error) {
            setError(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteClient(cin);
            navigate('/clients');
        } catch (error) {
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
            <h2>Client Details</h2>
            {client && (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>CIN</label>
                        <input type="text" className="form-control" value={client.cin} readOnly />
                    </div>
                    <div className="form-group">
                        <label>Nom</label>
                        <input type="text" className="form-control" name="nom" value={client.nom} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Prénom</label>
                        <input type="text" className="form-control" name="prenom" value={client.prenom} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Adresse</label>
                        <input type="text" className="form-control" name="adresse" value={client.adresse} onChange={handleInputChange} required />
                    </div>
                    <div className="form-group">
                        <label>Numéro de Téléphone</label>
                        <input type="text" className="form-control" name="numeroTelephone" value={client.numeroTelephone} onChange={handleInputChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Update</button>
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                </form>
            )}
        </div>
    );
};

export default ClientDetail;
