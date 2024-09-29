import React, { useState } from 'react';
import { createClient, checkClientExists } from '../../services/clientService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Card, Row, Col, CardTitle, CardBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';

const AddClientForm = () => {
    const [client, setClient] = useState({
        cin: '',
        nom: '',
        prenom: '',
        adresse: '',
        numeroTelephone: ''
    });
    const [error, setError] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClient({ ...client, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        const cinPattern = /^[0-9]{8}$/;
        const phonePattern = /^[0-9]{8,15}$/;

        if (!cinPattern.test(client.cin)) {
            errors.cin = 'Invalid CIN format. It should be 8 digits.';
        }
        if (!client.nom) {
            errors.nom = 'Name is required.';
        }
        if (!client.prenom) {
            errors.prenom = 'Surname is required.';
        }
        if (!client.adresse) {
            errors.adresse = 'Address is required.';
        }
        if (!phonePattern.test(client.numeroTelephone)) {
            errors.numeroTelephone = 'Invalid phone number format. It should be between 8 to 15 digits.';
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setFormErrors({});

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            const exists = await checkClientExists(client.cin);
            if (exists) {
                setError('Client with this CIN already exists.');
                toast.error('Client with this CIN already exists.');
                return;
            }

            await createClient(client);
            toast.success('Client added successfully!');
            setClient({
                cin: '',
                nom: '',
                prenom: '',
                adresse: '',
                numeroTelephone: ''
            });
            navigate('/clients');
        } catch (error) {
            console.error('Error adding client:', error);
            toast.error('Failed to add client. Please try again.');
        }
    };

    return (
        <Row>
            <Col>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-person-plus me-2"></i>
                        Add New Client
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="cin">CIN</Label>
                                <Input
                                    id="cin"
                                    name="cin"
                                    placeholder="Enter client CIN"
                                    type="text"
                                    value={client.cin}
                                    onChange={handleChange}
                                    className={formErrors.cin ? 'input-error' : ''}
                                />
                                {formErrors.cin && <div className="error">{formErrors.cin}</div>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="nom">Nom</Label>
                                <Input
                                    id="nom"
                                    name="nom"
                                    placeholder="Enter client name"
                                    type="text"
                                    value={client.nom}
                                    onChange={handleChange}
                                    className={formErrors.nom ? 'input-error' : ''}
                                />
                                {formErrors.nom && <div className="error">{formErrors.nom}</div>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="prenom">Prénom</Label>
                                <Input
                                    id="prenom"
                                    name="prenom"
                                    placeholder="Enter client surname"
                                    type="text"
                                    value={client.prenom}
                                    onChange={handleChange}
                                    className={formErrors.prenom ? 'input-error' : ''}
                                />
                                {formErrors.prenom && <div className="error">{formErrors.prenom}</div>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="adresse">Adresse</Label>
                                <Input
                                    id="adresse"
                                    name="adresse"
                                    placeholder="Enter client address"
                                    type="text"
                                    value={client.adresse}
                                    onChange={handleChange}
                                    className={formErrors.adresse ? 'input-error' : ''}
                                />
                                {formErrors.adresse && <div className="error">{formErrors.adresse}</div>}
                            </FormGroup>
                            <FormGroup>
                                <Label for="numeroTelephone">Numéro de Téléphone</Label>
                                <Input
                                    id="numeroTelephone"
                                    name="numeroTelephone"
                                    placeholder="Enter client phone number"
                                    type="text"
                                    value={client.numeroTelephone}
                                    onChange={handleChange}
                                    className={formErrors.numeroTelephone ? 'input-error' : ''}
                                />
                                {formErrors.numeroTelephone && <div className="error">{formErrors.numeroTelephone}</div>}
                            </FormGroup>
                            {error && <div className="error">{error}</div>}
                            <Button color="primary" type="submit">
                                Add Client
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default AddClientForm;
