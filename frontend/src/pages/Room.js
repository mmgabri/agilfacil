import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import { useSocket } from "../customHooks/useSocket";
import "../styles/Sala.css"
import Header from './components/Header';
import StatusSection from './components/StatusSection';
import Users from './components/Users';
import VotingCards from './components/VotingCards';
import VotingResults from './components/VotingResults';
import Progress from './components/ProgressBar';


export const Room = ({ }) => {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [nota, setNota] = useState("");
  const [roomId, setRoomId] = useState([]);
  const [moderator, setModerator] = useState(false);
  const [roomData, setRoomData] = useState({
    roomName: '',
    status: '',
    users: [],
    _id: ''
  });

  const cards = [1, 2, 3, 5, 8, 13, 21, "?"];

  const { isConnected, socketResponse, updateStatusRoom, votar } = useSocket(
    location.state.userName,
    location.state.userId,
    location.state.roomId)


  useEffect(() => {
    console.log("useEffect-principal==>", location.state.userId, location.state.userName, location.state.roomId, location.state.roomName)
    setUserName(location.state.userName)
    setRoomId(location.state.roomId)
    setRoomName(location.state.roomName)
    setModerator(location.state.moderator)
  }, []);


  useEffect(() => {

    if (socketResponse.users) {
      setRoomData(socketResponse)
      if (roomData.status == 'VOTACAO_ENCERRADA')
        setNota("0")
    }
  }, [socketResponse]);

  const onCardClick = (nota) => {
    setNota(nota)
    votar({ vote: nota })
  }

  const handlerupdateStatusRoom = (status) => {
    updateStatusRoom({ status: status, roomId: { roomId } })
  }


  return (

    <div className="bg-black-custom">

      <Header userName={userName} roomName={roomName} />
      <StatusSection roomData={roomData} moderator={moderator} handlerupdateStatusRoom={handlerupdateStatusRoom} />

      {roomData.status == "VOTACAO_FINALIZADA"
        ?
        <div className="user-box">
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Progress roomData={roomData}  />
            <Users roomData={roomData} />
          </div>
          <div>
            <VotingResults roomData={roomData} cards={cards} />
          </div>
        </div>
        : <>
          {roomData.status == "VOTACAO_EM_ANDAMENTO" || roomData.status == "VOTACAO_FINALIZADA"
            ? <Progress roomData={roomData} />
            : <></>}
          <Users roomData={roomData} />
        </>
      }


      {roomData.status == "VOTACAO_EM_ANDAMENTO" || roomData.status == "VOTACAO_FINALIZADA"
        ? <VotingCards onCardClick={onCardClick} cards={cards} nota={nota} />
        : <></>}

    </div>
  );
}
export default Room