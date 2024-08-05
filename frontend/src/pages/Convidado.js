import React, { useEffect, useState, input, label } from "react";
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import { SERVER_BASE_URL } from "../constants/apiConstants";
import "../styles/CriarSala.css"

export const Sala = ({ }) => {
  const [userName, setUserName] = useState("");
  const [roomId, setRoomId] = useState("");
  
  let navigate = useNavigate();

  useEffect(() => {
    console.log("useEffect")

  }, []);


  const handleSubmit = e => {
    e.preventDefault()

    axios
      .post(SERVER_BASE_URL + '/joinRoom', { roomId: roomId, userName: userName })
      .then(response => {
        navigate('/sala', { state: {roomId: response.data.roomId, roomName: response.data.roomName,  userId: response.data.userId ,  userName: response.data.userName, moderator: response.data.moderator }});
      })
      .catch((error) => {
        console.log("Respoposta da api com erro:", error, error.response?.status)
      });
  }

  return (
    <div class="container text-center margin-top-5">
      <form action="" id="login" method="post" onSubmit={handleSubmit}>
        <h1>Entrar como convidado</h1>
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
          <label for="password">Sala ID</label>
          <input
            type="text"
            name="sala"
            id="sala"
            value={roomId}
            onChange={e => setRoomId(e.target.value)}
          />
        </p>
        <p className="item">
          <input type="submit" value="Entrar" />
        </p>
      </form>
    </div>
  );
}
export default Sala
