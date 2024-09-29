import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getClients } from '../../services/clientService';
import { createCompte } from '../../services/compteService';
import { Card, Row, Col, CardTitle, CardBody, Button, Form, FormGroup, Label, Input, Select } from 'reactstrap';

const AddCompte = () => {
    const [compte, setCompte] = useState({
        numeroCompte: '',
        solde: '',
        typeCompte: '',
        ocrs: [],
        clientCin: '',
        credits: []
    });
    const [clients, setClients] = useState([]);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getClients();
                setClients(response.data);
            } catch (error) {
                console.error('Error fetching clients:', error);
                toast.error('Failed to fetch clients.');
            }
        };

        fetchClients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCompte((prevCompte) => ({
            ...prevCompte,
            [name]: value,
        }));
    };

    const handleSoldeChange = (e) => {
        let value = e.target.value;

        // Remove non-numeric characters except for the comma
        value = value.replace(/[^0-9,]/g, '');

        // Replace comma with dot for number conversion
        value = value.replace(/,/g, '');

        // Convert to number to check if positive
        const numericValue = parseFloat(value);

        if (!isNaN(numericValue) && numericValue >= 0) {
            // Format number with comma as thousand separator
            const formattedValue = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' TND';
            setCompte((prevCompte) => ({
                ...prevCompte,
                solde: formattedValue,
            }));
        } else {
            // If invalid, reset to empty string
            setCompte((prevCompte) => ({
                ...prevCompte,
                solde: '',
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Remove " TND" before submitting
        const formattedCompte = {
            ...compte,
            solde: parseFloat(compte.solde.replace(/,/g, '').replace(' TND', ''))
        };

        try {
            await createCompte(formattedCompte);
            toast.success('Compte added successfully!');
            setCompte({
                numeroCompte: '',
                solde: '',
                typeCompte: '',
                ocrs: [],
                clientCin: '',
                credits: []
            });
        } catch (error) {
            toast.error('Failed to add compte.');
            console.error(error);
        }
    };

    return (
        <Row>
            <Col>
                <Card>
                    <CardTitle tag="h6" className="border-bottom p-3 mb-0">
                        <i className="bi bi-credit-card me-2"></i>
                        Add New Compte
                    </CardTitle>
                    <CardBody>
                        <Form onSubmit={handleSubmit}>
                            <FormGroup>
                                <Label for="numeroCompte">Numero Compte:</Label>
                                <Input
                                    type="text"
                                    id="numeroCompte"
                                    name="numeroCompte"
                                    value={compte.numeroCompte}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="solde">Solde:</Label>
                                <Input
                                    type="text"
                                    id="solde"
                                    name="solde"
                                    value={compte.solde}
                                    onChange={handleSoldeChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="typeCompte">Type Compte:</Label>
                                <Input
                                    type="text"
                                    id="typeCompte"
                                    name="typeCompte"
                                    value={compte.typeCompte}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="clientCin">Client CIN:</Label>
                                <Input
                                    type="select"
                                    id="clientCin"
                                    name="clientCin"
                                    value={compte.clientCin}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Client CIN</option>
                                    {clients.map(client => (
                                        <option key={client.cin} value={client.cin}>
                                            {client.cin}
                                        </option>
                                    ))}
                                </Input>
                            </FormGroup>
                            {/* Add fields for OCRs and Credits if needed */}
                            <Button color="primary" type="submit">
                                Add Compte
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
    );
};

export default AddCompte;
