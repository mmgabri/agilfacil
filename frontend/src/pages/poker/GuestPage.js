import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SuggestionForm from '../components/SuggestionForm'

import { useNavigate } from 'react-router-dom'
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import "../../styles/CreateRoomAndGuest.css"
import { Title } from '../../styles/GenericTitleStyles';
import Header from '../components/Header';


export const GuestPage = ({ }) => {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ userName: '', roomId: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault()

    axios
      .post(SERVER_BASE_URL + '/joinRoom', { roomId: formData.roomId, userName: formData.userName })
      .then(response => {
        navigate('/room', { state: { roomId: response.data.roomId, roomName: response.data.roomName, userId: response.data.userId, userName: response.data.userName, moderator: response.data.moderator } });
      })
      .catch((error) => {
        triggerError(error.response?.status)
      });
  }

  const triggerError = (statusCode) => {
    let message = 'Ocorreu um erro inesperado. Por favor, tente novamente.'

    if (statusCode == 404) {
      message = 'Sala inexistente. Por favor, peça um novo ID e tente novamente.'
    }

    toast.error(message, {
      position: 'top-center', // Usando string para a posição
      autoClose: 8000, // Fecha automaticamente após 8 segundos
      hideProgressBar: false,
      closeButton: true, // Mostra o botão de fechar
      draggable: true, // Permite arrastar a notificação
      pauseOnHover: true, // Pausa o fechamento automático ao passar o mouse
    });
  }

  const handleAbout = () => {
    navigate("/about")
  }

  const handleHome = () => {
    navigate("/")
  }

  const handleOpen = () => {
    setModalOpen(true);
  }

  return (

    <div className="bg-black-custom">
      <Header handleHome={handleHome} handleAbout={handleAbout} handleOpen={handleOpen} />

      <div className="form-container">
        <Title>Preencha os campos abaixo para entrar na sala de Planning Poker</Title>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Digite seu nome"
              required
              maxLength={12}
            />
          </div>
          <div className="form-group">
            <label htmlFor="id">Id da sala</label>
            <input
              type="text"
              id="roomId"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              placeholder="Digite o id da sala"
              required
            />
          </div>
          <button type="submit" className="submit-button">Entrar</button>
        </form>
      </div>
      {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
    </div>
  );
}
export default GuestPage 