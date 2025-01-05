import React, { useEffect, useState } from "react";
import axios from "axios";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom'
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import "../../styles/CreateRoomAndGuest.css"
import LoaderPage from "../generic/LoaderPage"
import localStorageService from "../../services/localStorageService";
import getIP from "../../services/getIP"
import { v4 as uuidv4 } from 'uuid';


export const GuestUrlRetroPage = ({ }) => {
  const { id } = useParams();
  let navigate = useNavigate();

  useEffect(() => {

    const initializeUserData = async () => {
      try {
        let storedUserlogged = localStorageService.getItem("AGILFACIL_USER_LOGGED");
        console.log('useEffect', storedUserlogged)

        if (!storedUserlogged) {
          const ip = await getIP();
          const storedUserData = {
            userId: uuidv4(),
            userIp: ip,
          };
          console.log('storedUserlogged -->', storedUserlogged)
          localStorageService.setItem("AGILFACIL_USER_LOGGED", storedUserData);
          directsBoard(storedUserData)
        } else {
          directsBoard(storedUserlogged)
        }

      } catch (error) {
        console.error("Erro ao inicializar os dados do usuário:", error);
      }
    };

    initializeUserData();

  }, []);


  const directsBoard = (userLoggedData) => {
    try {
      axios
        .get(`${SERVER_BASE_URL}/retro/${id}`)
        .then((response) => {
          console.log('Retorno da API getBoard:', response.data);
          navigate('/board', { state: { boardData: response.data, userLoggedData: userLoggedData } });
        })
        .catch((error) => {
          console.log("Resposta da api getRoom com erro:", error.response?.status)
          navigate('/notification', { state: { statusCode: error.response?.status } });
        });

    } catch (error) {
      console.error("Erro ao obter dados do Board:", error);
    }
  };


  return (
    <LoaderPage />
  );
}
export default GuestUrlRetroPage