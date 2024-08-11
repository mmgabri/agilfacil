import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import { SERVER_BASE_URL } from "../constants/apiConstants";
import "../styles/CriarSala.css"


export const CreateRoom  = ({ }) => {
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  let navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault()

    axios
      .post(SERVER_BASE_URL + '/createRoom', { roomName: roomName, userName: userName })
      .then(response => {
        navigate('/room', { state: {roomId: response.data.roomId, roomName: response.data.roomName,  userId: response.data.userId ,  userName: response.data.userName, moderator: response.data.moderator }});
      })
      .catch((error) => {
        console.log("Respoposta da api com erro:", error, error.response?.status)
      });
  }

  return (
    <div class="container text-center margin-top-5">
      <form action="" id="login" method="post" onSubmit={handleSubmit}>
        <h1>Criar Sala</h1>
        <p className="item">
          <label for="email"> Nome </label>
          <input
            type="text"
            name="nome"
            id="emailnome"
            value={userName}
            onChange={e => setUserName(e.target.value)}
          />
        </p>
        <p className="item">
          <label for="password">Nome da sala</label>
          <input
            type="text"
            name="sala"
            id="sala"
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
          />
        </p>
        <p className="item">
          <input type="submit" value="Criar" />
        </p>
      </form>
    </div>
  );
}
export default CreateRoom 