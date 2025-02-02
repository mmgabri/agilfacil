import React, { useEffect, useState } from "react";
import axios from "axios";
import { getCurrentUser, fetchUserAttributes } from '@aws-amplify/auth';
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
    console.log('useEffect')

    const initializeUserData = async () => {
      try {
        localStorageService.removeItem("AGILFACIL_USER_LOGGED");

        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes(user);

        const userData = { userId: attributes.sub, userName: attributes.name, isBoardCreator: false }
        localStorageService.setItem("AGILFACIL_USER_LOGGED", userData);
        directsBoard(userData)

      } catch (error) {
        if (error.toString().includes("UserUnAuthenticatedException")) {
          const userData = { userId: uuidv4(), isBoardCreator: false }
          localStorageService.setItem("AGILFACIL_USER_LOGGED", userData);
          directsBoard(userData)
        } else {
          console.error("Erro ao inicializar os dados do usuário:", error);
          emitMessage('error', 999)
        }
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
      emitMessage('error', 999)
    }
  };

  return (
    <LoaderPage />
  );
}
export default GuestUrlRetroPage