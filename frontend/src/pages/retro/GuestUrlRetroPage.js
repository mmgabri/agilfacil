import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; 
import styled, { keyframes } from 'styled-components'; 
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom'
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import "../../styles/CreateRoomAndGuest.css"
import { Title } from '../../styles/GenericTitleStyles';
import Header from '../components/Header';
import SuggestionForm from '../components/SuggestionForm'

// Definindo a animação de rotação usando keyframes
const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

// Estilos com styled-components
const Loader = styled.div`
  color: #fff;
  text-align: center;
  margin-top: 20px;
  font-size: 2rem;
  animation: ${spin} 1s linear infinite;  // Aplica a animação de rotação
`;

const BoardContainer = styled.div`
  background-color: #1C1C1C;
  padding: 10px;
  display: grid;
  grid-auto-flow: column;
  gap: 10px;
  width: 100%;
  overflow-x: auto;
`;

const ColumnContainer = styled.div`
  min-width: 250px;
  background-color: #282c34;
  border: 1px solid #444;
  border-radius: 8px;
  padding: 10px;
`;

export const GuestUrlRetroPage = ({ }) => {
    const { id } = useParams(); // Obtém o ID da URL
    let navigate = useNavigate();

    useEffect(() => {
        axios
            .get(`${SERVER_BASE_URL}/retro/${id}`)
            .then((response) => {
                console.log('Retorno da API getBoard:', response.data);
                navigate('/board', { state: { boardData: response.data } });
            })
            .catch((error) => {
                console.log("Resposta da api getRoom com erro:", error.response?.status)
                navigate('/notification', { state: { statusCode: error.response?.status } });
            });

    }, []);


    return (
        <Loader>
        <FaSpinner />
      </Loader>
    );
}
export default GuestUrlRetroPage