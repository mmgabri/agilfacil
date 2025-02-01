import React, { useState } from 'react';
import axios from "axios";
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import Modal from '../components/Modal';
import { toast } from 'react-toastify';
import { FormContainer, FormGroup, TitleAddCard, SubmitButton, TextArea } from '../../styles/SuggestionFormStyles';
//import { FormContainer, Title, FormGroup, TextArea } from '../../styles/FormStyle'

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
                <TitleAddCard>{title}</TitleAddCard>
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
                    <SubmitButton type="submit">Adicionar Card</SubmitButton>
                </form>
            </FormContainer>
        </Modal>
    );
};

export default ModalAddCard;
