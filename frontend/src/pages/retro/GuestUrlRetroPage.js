import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSpinner } from "react-icons/fa";
import styled, { keyframes } from 'styled-components';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom'
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import "../../styles/CreateRoomAndGuest.css"
import LoaderPage from "../generic/LoaderPage"


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
    <LoaderPage />
  );
}
export default GuestUrlRetroPage