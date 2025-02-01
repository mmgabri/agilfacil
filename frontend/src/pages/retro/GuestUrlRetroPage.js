import React, { useEffect, useState } from "react";
import axios from "axios";
import { emitMessage } from '../generic/Utils'
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate, useParams } from 'react-router-dom'
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import "../../styles/CreateRoomAndGuest.css"
import LoaderPage from "../generic/LoaderPage"
import localStorageService from "../../services/localStorageService";
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
          const storedUserData = {
            userId: uuidv4(),
            userName: '',
            isBoardCreator: false
          };
          localStorageService.setItem("AGILFACIL_USER_LOGGED", storedUserData);
          directsBoard(storedUserData)
        } else {
          directsBoard(storedUserlogged)
        }

      } catch (error) {
        console.error("Erro ao inicializar os dados do usuário:", error);
        emitMessage('error',999 )
      }
    };

    initializeUserData();

  }, []);


  const directsBoard = async (userLoggedData) => {
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/retro/${id}`)
      navigate('/board', { state: { boardData: response.data, userLoggedData: userLoggedData } });
    } catch (error) {
      console.error("Erro ao obter dados do Board:", error);
      emitMessage('error',999 )
    }
  };

  return (
    <LoaderPage />
  );
}
export default GuestUrlRetroPage