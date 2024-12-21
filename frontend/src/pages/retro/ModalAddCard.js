import React, { useState } from 'react';
import axios from "axios";
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { Title, FormContainer, FormGroup, Input, TextArea, TitleAddCard } from '../../styles/SuggestionFormStyles';

const ModalAddCard = ({ isOpen, onClose, onSubmit, title }) => {
    const [formData, setFormData] = useState({
        userName: '',
        roomId: '',
    });
    const [textareaValue, setTextareaValue] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(textareaValue);
        setTextareaValue('');
        onClose();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };


    return (

        <Modal isOpen={true} onClose={onClose}>
            <FormContainer>
                <TitleAddCard>Coluna: {title}</TitleAddCard>
                <form onSubmit={handleSubmit}>
                    <FormGroup>
                        <TextArea
                            id="contentCard"
                            name="contentCard"
                            value={textareaValue}
                            onChange={(e) => setTextareaValue(e.target.value)}
                            placeholder="Digite aqui o seu Card..."
                            maxLength={500}
                            rows={4}
                            required
                        />
                    </FormGroup>
                    <button type="submit" className="submit-button">Adicionar Card</button>
                </form>
            </FormContainer>
        </Modal>
    );
};

export default ModalAddCard;