import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { MDBCard, MDBCardBody, MDBCardFooter, MDBCol, MDBRow, MDBBtn, MDBProgress, MDBProgressBar, MDBContainer, } from 'mdb-react-ui-kit';
import { useSocket } from "../customHooks/useSocket";
import "../styles/Sala.css"

export const Sala = ({ }) => {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [nota, setNota] = useState("");
  const [notas, setNotas] = useState(["2", "3", "5", "8", "13", "?"]);
  const [roomId, setRoomId] = useState([]);
  const [moderator, setModerator] = useState(false);
  const [roomData, setRoomData] = useState({
    roomName: '',
    status: '',
    users: [],
    _id: ''
  });

  const { isConnected, socketResponse, updateStatusRoom, votar } = useSocket(
    location.state.userName,
    location.state.userId,
    location.state.roomId)


  useEffect(() => {
    console.log("useEffect-principal==>", location.state.userId, location.state.userName, location.state.roomId, location.state.roomName)
    setUserId(location.state.userId)
    setUserName(location.state.userName)
    setRoomId(location.state.roomId)
    setModerator(location.state.moderator)
  }, []);


  useEffect(() => {
    console.log("useEffect-socketResponse ===>", socketResponse)

    if (socketResponse.users) {
      setRoomData(socketResponse)
      if (roomData.status == 'VOTACAO_ENCERRADA')
        setNota("0")
    }
  }, [socketResponse]);

  const handlerVotar = (nota) => {
    setNota(nota)
    votar({ vote: nota })
  }

  const handlerupdateStatusRoom = (status) => {
    updateStatusRoom({ status: status, roomId: { roomId } })
  }

  const handleBuildButtonStatus = () => {

    switch (roomData.status) {
      case "AGUARDANDO_LIBERACAO":
        return <button type="button" class="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_EM_ANDAMENTO")}>Liberar Votação</button>
      case "VOTACAO_EM_ANDAMENTO":
        return <button type="button" class="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_FINALIZADA")}>Finalizar Votação</button>
      case "VOTACAO_FINALIZADA":
        return <button type="button" class="btn btn-primary" onClick={() => handlerupdateStatusRoom("VOTACAO_ENCERRADA")}>Encerrar Votação</button>
      case "VOTACAO_ENCERRADA":
        return <button type="button" class="btn btn-primary" onClick={() => handlerupdateStatusRoom("AGUARDANDO_LIBERACAO")}>Nova Votação</button>
    }
  };

  return (

    <MDBContainer  >
      <div class="card d-flex justify-content-around mgtop-1">
        <div class="card-body">
          <div class="d-flex justify-content-around">
            <MDBBtn outline className='mx-2' color='secondary'>Convidar Paricipantes</MDBBtn>
            <p className="fw-bolder">Sala: {roomId}</p>
            <p className="fw-bolder">Paricipante: {userName}</p>
            <MDBBtn outline className='mx-2' color='secondary'>Sair</MDBBtn>
          </div>
        </div>
      </div>

      <div class="card d-flex justify-content-around margin-top-5">
        <div class="card-body">
          <div class="d-flex justify-content-around">
            <p className="fw-bolder"> Status: {roomData.status}</p>
            {moderator ? (
              <>
                {handleBuildButtonStatus()}
              </>
            ) :
              <></>}
          </div>
        </div>
      </div>


      <MDBRow className='margin-top-5 '>
        {
          roomData.users.map((item, index) => {
            return <MDBCol xl={3} className='mb-4'>
              <MDBCard className='mg-5 '>
                <MDBCardBody >
                  <div className='d-flex justify-content-between align-items-center'>
                    <div className='d-flex align-items-center'>
                      <div className='ms-3'>
                        <p className='fw-bold mb-1'>{item.userName}</p>
                      </div>
                    </div>
                  </div>
                </MDBCardBody>

                <MDBCardFooter background='light' border='0' className='p-2 d-flex justify-content-around'>
                  {roomData.status == "AGUARDANDO_LIBERACAO"
                    ? (<></>)
                    : (
                      <>
                        {item.vote == 0
                          ? (<> </>)
                          :
                          (<>
                            {roomData.status === 'VOTACAO_EM_ANDAMENTO' || roomData.status === 'VOTACAO_ENCERRADA'
                              ? (<MDBBtn size='sm' >_</MDBBtn>)
                              : (<MDBBtn size='sm' >{item.vote}</MDBBtn>)}
                          </>)}
                      </>
                    )}
                </MDBCardFooter>
              </MDBCard>
            </MDBCol>
          })
        }
      </MDBRow>


      <MDBProgress className='margin-top-5 ' height='20'>
        <MDBProgressBar width='25' valuemin={0} valuemax={100}>
          25%
        </MDBProgressBar>
      </MDBProgress>


      {roomData.status == "VOTACAO_EM_ANDAMENTO" || roomData.status == "VOTACAO_FINALIZADA" ? (
        <div class="d-flex justify-content-around mgtop4">
          {notas.map((item, index) => {
            return <>
              {nota == item
                ? (<MDBBtn className='btn-nota-select' size='xl' >{item}</MDBBtn>)
                : (<MDBBtn className='btn-nota' size='xl' onClick={() => handlerVotar( item )} >{item}</MDBBtn>)}
            </>
          })
          }
        </div>

      ) : (
        <></>
      )}

      <div class="card align-items-center mgtop4">
      </div>
    </MDBContainer>
  );
}
export default Sala