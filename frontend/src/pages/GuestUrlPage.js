import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom'
import { SERVER_BASE_URL } from "../constants/apiConstants";
import "../styles/CreateRoomAndGuest.css"
import Header from './components/Header';


export const GuestUrlPage = ({ }) => {
    const { id } = useParams(); // Obtém o ID da URL
    let navigate = useNavigate();
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
                console.log('Retorno da API getRoom:', response);
                setRoomId(response.data._id)
                setRoomName(response.data.roomName)
            })
            .catch((error) => {
                console.log("Resposta da api getRoom com erro:", error.response?.status)
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
                console.log("Respoposta da api com erro:", error, error.response?.status)
            });
    }

    return (
        <div className="bg-black-custom">
            <Header />

            <div className="form-container">
                <h1>Informe os dados abaixo</h1>
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
                            value={roomId}
                            disabled
                            className="disabled-input" // Aplicar a classe personalizada
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="id">Nome da Sala</label>
                        <input
                            type="text"
                            value={roomName}
                            disabled
                            className="disabled-input" // Aplicar a classe personalizada
                        />
                    </div>
                    <button type="submit" className="submit-button">Entrar</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}
export default GuestUrlPage