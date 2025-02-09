import React, { useEffect, useState } from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom'
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import styled from 'styled-components';
import Header from '../poker/components/HeaderPlanning';
import { emitMessage, formatdateTime } from '../../services/utils'
import SuggestionForm from '../components/SuggestionForm'
import { FormContainer, FormGroup, StyledForm, SubmitButton } from '../../styles/FormStyle'

export const GuestUrlPage = ({ }) => {
    const { id } = useParams(); // Obtém o ID da URL
    let navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);
    const [formData, setFormData] = useState({ userName: '' });
    const [roomId, setRoomId] = useState('');
    const [roomName, setRoomName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        axios
            .get(`${SERVER_BASE_URL}/rooms/${id}`)
            .then((response) => {
                //console.log('Retorno da API getRoom:', response);
                setRoomId(response.data._id)
                setRoomName(response.data.roomName)
            })
            .catch((error) => {
                navigate('/notification', { state: { statusCode: error.response?.status } });
            });

    }, []);


    const handleSubmit = e => {
        e.preventDefault()

        axios
            .post(SERVER_BASE_URL + '/joinRoom', { roomId: roomId, userName: formData.userName })
            .then(response => {
                navigate('/room', { state: { roomId: response.data.roomId, roomName: response.data.roomName, userId: response.data.userId, userName: response.data.userName, moderator: response.data.moderator } });
            })
            .catch((error) => {
                emitMessage('error', 999)
            });
    }

    const handleHome = () => {
        navigate("/")
    }

    const handleAbout = () => {
        navigate("/about")
    }


    const handleOpen = () => {
        setModalOpen(true);
    }

    return (
        <div className="bg-black-custom">
            <Header handleHome={handleHome} handleAbout={handleAbout} handleOpen={handleOpen} />

            <FormContainer>
                <Title>Informe seu nome para entrar na sala de Planning Poker</Title>
                <StyledForm onSubmit={handleSubmit}>
                    <FormGroup>
                        <label htmlFor="userName">Digite seu nome*</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={formData.userName}
                            onChange={handleChange}
                            placeholder="Digite o nome do board"
                            required
                            maxLength={55} />
                    </FormGroup>
                    <FormGroup2>
                        <label htmlFor="roomId">ID da sala</label>
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            value={roomId}
                            disabled />
                    </FormGroup2>
                    <FormGroup2>
                        <label htmlFor="roomName">Nome da sala</label>
                        <input
                            type="text"
                            id="roomName"
                            name="roomName"
                            value={roomName}
                            disabled />
                    </FormGroup2>
                    <SubmitButton $marginTop="22px" type="submit">Entrar</SubmitButton>
                </StyledForm>
            </FormContainer>

            {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
        </div>
    );

}

export const Title = styled.h1`
  font-size: 1.2rem;
  margin-bottom: 30px;
  color: #C0C0C0;
  font-weight: 400;
  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const FormGroup2 = styled.div`
  margin-bottom: 15px;

  label {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    color: #C0C0C0;
    font-size: 14px;
  }

  input {
   background: #B0B0B0;
    width: 100%;
    padding: 7px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 15px;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;

    &:focus {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
      outline: none;
    }
  }
`;


export default GuestUrlPage