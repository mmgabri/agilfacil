import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { FaClock } from 'react-icons/fa';
import { createUseStyles } from "react-jss";
import styled from 'styled-components';
import { FaRegStickyNote, FaUsers, FaUserAlt } from 'react-icons/fa';
import { DragDropContext } from "react-beautiful-dnd";
import { v4 as uuidv4 } from 'uuid';
import Columns from "./Columns";
import { reorderboardData, processCombine, saveCard, deleteCard, updateLike, updateTitleColumn, deleteColumn, addCard, updatecolorCards, deleteAllCards } from "./FunctionsRetro";
import Header from './HeaderBoard';
import Invite from '../components/Invite';
import SuggestionForm from '../components/SuggestionForm'
import { useSocket } from "../../customHooks/useSocket";
import 'react-toastify/dist/ReactToastify.css';
import './retro.css';

export const BoardPage = ({ }) => {
  let navigate = useNavigate();
  const [timeInput, setTimeInput] = useState("00:00"); // Tempo digitado pelo usuário
  const [timer, setTimer] = useState(0); // Tempo em segundos
  const [isRunning, setIsRunning] = useState(false); // Status do cronômetro

  const [isModalOpen, setModalOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const location = useLocation();
  const [boardData, setBoardData] = useState({ columns: [] });
  const cl = useStyles();
  const handleShowInvite = () => setShowInvite(true);
  const handleCloseInvite = () => setShowInvite(false);
  const [userLoggedData, setuserLoggedData] = useState({});

  const { socketResponse, addCardSocket, reorderBoardSocket, combineCardSocket, updateTitleColumnSocket, updateLikeSocket, deleteCardSocket, saveCardSocket, deleteColumnSocket, updatecolorCardsSocket, deleteAllCardSocket } = useSocket(location.state.userName, location.state.userId, location.state.boardData.boardId, 'board')


  useEffect(() => {
    console.log('useEffect-principal', location.state.boardData, location.state.userLoggedData)
    setBoardData(location.state.boardData);
    setuserLoggedData(location.state.userLoggedData);
  }, [location.state.boardData, location.state.userLoggedData]);

  useEffect(() => {
    // console.log('useEffect - socketResponse ==>', socketResponse);

    if (socketResponse && socketResponse.boardId) {
      setBoardData(prevBoardData => ({
        ...prevBoardData,
        ...socketResponse, // Garante que as novas referências sejam criadas
      }));
    }
  }, [socketResponse]);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) {
          const minutes = String(Math.floor((prev - 1) / 60)).padStart(2, "0");
          const seconds = String((prev - 1) % 60).padStart(2, "0");
          setTimeInput(`${minutes}:${seconds}`); // Atualiza o input ao diminuir o tempo
          return prev - 1;
        } else {
          setIsRunning(false); // Para o cronômetro quando chega a 0
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [isRunning]);

  const onDragEnd = (result) => {
    console.log('--- onDragEnd ---')
    console.log('result', result);

    const { source, destination, combine } = result;

    if (destination) {
      reorderBoardSocket({ source, destination })
      const updatedColumns = reorderboardData(boardData, source, destination);
      setBoardData({ ...boardData, columns: updatedColumns });
    } else if (combine) {
      combineCardSocket({ source, combine })
      const updatedColumns = processCombine(boardData, source, combine);
      setBoardData({ ...boardData, columns: updatedColumns });
    }

  };

  const exitBoard = e => {
    navigate('/');
  }

  const handleOpenSugestion = () => {
    setModalOpen(true);
  }

  const onSaveCard = (content, indexCard, indexColumn) => {
    const updatedColumns = saveCard(boardData, content, indexCard, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    saveCardSocket({ content: content, indexCard: indexCard, indexColumn: indexColumn })
  };

  const onDeleteCard = (indexCard, indexColumn) => {
    const updatedColumns = deleteCard(boardData, indexCard, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    deleteCardSocket({ indexCard: indexCard, indexColumn: indexColumn })
  };

  const onDeleteAllCard = (indexColumn) => {
    const updatedColumns = deleteAllCards(boardData, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    deleteAllCardSocket({ indexColumn: indexColumn })
  };

  const onUpdateLike = (isIncrement, indexCard, indexColumn) => {
    const updatedColumns = updateLike(boardData, isIncrement, indexCard, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    updateLikeSocket({ isIncrement: isIncrement, indexCard: indexCard, indexColumn: indexColumn })
  };

  const onUpdateTitleColumn = (content, index) => {
    const updatedColumns = updateTitleColumn(boardData, content, index);
    setBoardData({ ...boardData, updatedColumns });
    updateTitleColumnSocket({ content: content, index: index })
  };

  const onUpdatecolorCards = (colorCards, index) => {
    const updatedColumns = updatecolorCards(boardData, colorCards, index);
    setBoardData({ ...boardData, updatedColumns });
    updatecolorCardsSocket({ colorCards: colorCards, index: index })
  };

  const onDeleteColumn = (index) => {
    console.log('onDeleteColumn', index)
    const updatedColumns = deleteColumn(boardData, index);
    setBoardData({ ...boardData, updatedColumns });
    deleteColumnSocket({ index: index })
  };

  const onAddCard = (newCard, indexColumn) => {
    console.log('onAddCard')
    const updatedColumns = addCard(boardData, newCard, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    addCardSocket({ newCard: newCard, indexColumn: indexColumn })
  };


  const handleAddColumn = () => {

  };

  const handleBlurBoard = () => {

  };

  // Atualiza o tempo com base na entrada do usuário
  const handleInputChange = (e) => {
    const value = e.target.value;
    setTimeInput(value);
    const [minutes, seconds] = value.split(":").map(Number);
    setTimer((minutes || 0) * 60 + (seconds || 0));
  };

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-black-custom">
      <Header boardName={boardData.boardName} handleShowInvite={handleShowInvite} handleCloseInvite={handleCloseInvite} sairSala={exitBoard} handleOpenSugestion={handleOpenSugestion} />
      {showInvite && <Invite id={boardData.boardId} onClose={handleCloseInvite} service={'board'} />}

      <BoardControls>
        <InfoBox>
          <InfoColumn>
            <InfoTitle>
              <InfoIcon>
                <FaRegStickyNote />
              </InfoIcon>
              Cards
            </InfoTitle>
            <InfoCount>{9}</InfoCount>
          </InfoColumn>
          <InfoColumn>
            <InfoTitle>
              <InfoIcon>
                <FaUsers />
              </InfoIcon>
              Usuários que Logaram
            </InfoTitle>
            <InfoCount>{5}</InfoCount>
          </InfoColumn>
          <InfoColumn>
            <InfoTitle>
              <InfoIcon>
                <FaUserAlt />
              </InfoIcon>
              Usuários com Cards
            </InfoTitle>
            <InfoCount>{3}</InfoCount>
          </InfoColumn>
        </InfoBox>
        <BoardActions>
          <TimerBox>
            <TimerIcon />
            <TimerInput
              type="text"
              value={timeInput}
              onChange={handleInputChange}
              disabled={isRunning}
              placeholder="MM:SS"
            />
            <TimerControls>
              {!isRunning && (
                <TimerButton onClick={() => setIsRunning(true)}>Iniciar</TimerButton>
              )}
              {isRunning && (
                <TimerButton className="pause" onClick={() => setIsRunning(false)}>Pausar</TimerButton>
              )}
            </TimerControls>
          </TimerBox>
          <ActionButton onClick={handleAddColumn}>
            <span role="img" aria-label="Add Column">➕</span> Incluir Coluna
          </ActionButton>
          <ActionButton onClick={handleBlurBoard}>
            <span role="img" aria-label="Blur Board">💨</span> Embaçar Board
          </ActionButton>
        </BoardActions>
      </BoardControls>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={cl.root}>
          {boardData.columns.map((column, index) => (
            <div key={column.id} className={cl.column}>
              <Columns
                title={column.title}
                colorCards={column.colorCards}
                listId={column.id}
                listType="card"
                cards={column.cards}
                isCombineEnabled={true}
                onSaveCard={onSaveCard}
                onDeleteCard={onDeleteCard}
                onDeleteAllCard={onDeleteAllCard}
                onUpdateLike={onUpdateLike}
                onUpdateTitleColumn={onUpdateTitleColumn}
                onDeleteColumn={onDeleteColumn}
                onAddCard={onAddCard}
                onUpdatecolorCards={onUpdatecolorCards}
                indexColumn={index}
                userLoggedData={userLoggedData}
              />
            </div>
          ))}
        </div>
      </DragDropContext>
      {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
    </div>
  );
}


// Estilização principal do controle do board
const BoardControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #2c2c2c;
  color: #fff;
  flex-wrap: wrap; /* Adiciona flexibilidade ao layout */

  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const InfoBox = styled.div`
  display: inline-flex; /* Ajusta a largura de acordo com o conteúdo das colunas */
  padding: 8px 16px;
  background-color: #2f2f2f;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 3px;
  gap: 20px;
  flex-wrap: wrap; /* Permite que as colunas se ajustem quando necessário */

  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    width: 100%;
    gap: 10px; /* Ajusta o espaçamento entre as colunas */
  }
`;


const InfoColumn = styled.div`
  text-align: center;
  flex-shrink: 0; /* Evita que a coluna encolha */
  min-width: 120px; /* Define uma largura mínima para as colunas */

  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    width: 33%; /* Em telas pequenas, as colunas ocupam 1/3 do espaço */
  }
`;


const InfoTitle = styled.h3`
  font-size: 12px;
  color: #fff;
  margin-bottom: 3px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5px;
`;

const InfoIcon = styled.div`
  font-size: 12px;
  background-color: #444;
  border-radius: 50%;
  padding: 4px;
  color: #fff;
`;

const InfoCount = styled.p`
  font-size: 14px;
  color: #4caf50;
  font-weight: bold;
  margin: 0px;
`;


// Estilização para ações do board
const BoardActions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap; /* Adiciona flexibilidade ao layout */

  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    justify-content: center; /* Centraliza os botões em telas menores */
    width: 100%; /* Ocupa toda a largura disponível */
  }
`;

// Estilização dos botões de ação
const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  background-color: #3c3c3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #4c4c4c;
  }

  span {
    font-size: 16px;
  }

  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    width: 100%; /* Os botões ocupam toda a largura */
    justify-content: center; /* Centraliza o conteúdo */
    margin-bottom: 10px; /* Espaçamento entre os botões */
  }
`;

//---------Timer
const TimerBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  background-color: #3c3c3c;
  border-radius: 8px;
  color: #fff;
  gap: 10px;
`;

const TimerInput = styled.input`
  width: 60px;
  padding: 5px;
  text-align: center;
  font-size: 14px;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #222;
  color: #fff;
`;

const TimerControls = styled.div`
  display: flex;
  gap: 8px;
`;

const TimerButton = styled.button`
  padding: 5px 8px;
  font-size: 12px;
  border: none;
  border-radius: 4px;
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }

  &.pause {
    background-color: #f44336;

    &:hover {
      background-color: #d32f2f;
    }
  }
`;

const TimerIcon = styled(FaClock)`
  font-size: 20px;
  color: #fff;
  margin-right: 10px;
`;


export default BoardPage;


// Estilizações

const useStyles = createUseStyles({
  root: {
    backgroundColor: "#1C1C1C",
    boxSizing: "border-box",
    padding: 10,
    height: "auto", // Ajusta automaticamente a altura conforme o conteúdo
    display: "grid",
    gridAutoFlow: "column",
    gridAutoColumns: "1fr",
    gap: "10px",
    width: "100%",
    overflowX: "auto", // Pode ser necessário manter a rolagem horizontal, dependendo da largura
  },

  column: {
    minWidth: "250px",
    minHeight: "400px", // Altura mínima para evitar que a coluna encolha demais
    height: "auto", // Permite que a coluna se ajuste conforme o conteúdo
    backgroundColor: "#282c34",
    border: "1px solid #444",
    borderRadius: "8px",
    boxSizing: "border-box",
    padding: "0px",
    transition: "width 0.3s ease, height 0.3s ease", // Animação também para a altura
    display: "flex",
    flexDirection: "column",
    //   overflow: "auto", // Faz com que a altura da coluna se ajuste conforme o conteúdo
  }

}

);
