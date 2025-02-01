import React, { useState } from "react";
import axios from "axios";
import { emitMessage } from '../generic/Utils'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom'
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import "../../styles/CreateRoomAndGuest.css"
import { Title } from '../../styles/GenericTitleStyles';
import Header from '../components/Header';
import SuggestionForm from '../components/SuggestionForm'

export const CreateRoomPage = ({ }) => {
  let navigate = useNavigate();
  const [formData, setFormData] = useState({ userName: '', roomName: '' });
  const [isModalOpen, setModalOpen] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = e => {
    e.preventDefault()

    axios
      .post(SERVER_BASE_URL + '/createRoom', { roomName: formData.roomName, userName: formData.userName })
      .then(response => {
        navigate('/room', { state: { roomId: response.data.roomId, roomName: response.data.roomName, userId: response.data.userId, userName: response.data.userName, moderator: response.data.moderator } });
      })
      .catch((error) => {
        console.log("Respoposta da api com erro:", error, error.response?.status)
        emitMessage('error', 905, 3000 )
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
        <Title>Preencha os campos abaixo para criar a sala de Planning Poker</Title>
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
            <label htmlFor="id">Nome da sala</label>
            <input
              type="text"
              id="roomName"
              name="roomName"
              value={formData.roomName}
              onChange={handleChange}
              placeholder="Digite o nome da sala"
              required
              maxLength={30}
            />
          </div>
          <button type="submit" className="submit-button">Criar Sala</button>
        </form>
      </div>
      {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
    </div>
  );
}
export default CreateRoomPage 