import React, { useEffect, useState } from 'react';
import axios from "axios";
import { emitMessage, formatdateTime } from '../generic/Utils'
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { signOut, getCurrentUser, fetchUserAttributes, fetchAuthSession } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom'
import { FaRegTrashAlt, FaRegFolderOpen, FaRegClone } from 'react-icons/fa';
import { AiOutlineExport } from "react-icons/ai";
import styled from 'styled-components';
import Header from './HeaderCreateBoard';
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import { FRONT_BASE_URL } from "../../constants/apiConstants";
import LoaderPage from '../generic/LoaderPage';
import SuggestionForm from '../components/SuggestionForm'

const BoardListPage = () => {
  let navigate = useNavigate();
  const [boards, setBoards] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userLoggedData, setuserLoggedData] = useState({});

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes(user);
        const userData = {
          userId: attributes.sub,
          userName: attributes.name,
        };
        setuserLoggedData(userData)

        // Obtem Board do Usuário Logado     
        const token = await getToken()

        axios
          .get(`${SERVER_BASE_URL}/retro/getBoardByUser/${attributes.sub}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            })
          .then(response => {
            setBoards(response.data);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.log("Resposta da api com erro:", error, error.response?.status)
            emitMessage('error', 999, 3000)
          });
      } catch (error) {
        console.error("Erro ao obter dados do usuário:", error);
      }
    };

    fetchBoards();
  }, []);

  async function getToken() {
    try {
      const session = await fetchAuthSession();
      const token = session.tokens.idToken.toString();
      return token;
    } catch (error) {
      console.error("Erro ao obter o token:", error.message);
      throw error;
    }
  }

  const handleDelete = async (id) => {
    console.log('handleDelete', id)
    const token = await getToken()
    setIsLoading(true)
    try {
      const response = await axios.delete(`${SERVER_BASE_URL}/retro/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      emitMessage('success', 1, 1500)
      setIsLoading(false)
      setBoards((prevBoards) => prevBoards.filter(board => board.boardId !== id));
    } catch (error) {
      console.log("Resposta da api com erro:", error)
      emitMessage('error', 901, 3000)
      setIsLoading(false)
    }
  };

  const handleOpenBoard = async (boardId) => {
    try {
      setIsLoading(true)
      const response = await axios.get(`${SERVER_BASE_URL}/retro/${boardId}`)
      setIsLoading(false)
      const userData = { userId: userLoggedData.userId, userName: userLoggedData.userName, isBoardCreator: true }
      navigate('/board', { state: { boardData: response.data, userLoggedData: userData } });
    } catch (error) {
      setIsLoading(false)
      console.log("Resposta da api com erro:", error)
      emitMessage('error', 902, 3000)
    }
  }

  const handleCreateBoard = () => {
    navigate('/board/create', { state: { userLoggedData: userLoggedData } });
  };

  const handleCloneBoard = async (boardId) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${SERVER_BASE_URL}/retro/${boardId}`)
      setIsLoading(false)
      console.log('response ==> ', response)
      navigate('/board/create', { state: { userLoggedData: userLoggedData, board: response.data } });
    } catch (error) {
      console.log("Resposta da api com erro:", error)
      emitMessage('error', 903, 3000)
      setIsLoading(false)
    }
  }

  const exitBoard = async () => {
    try {
      await signOut();
      console.log('Usuário desconectado com sucesso!');
      window.location.href = '/';
    } catch (error) {
      console.error('Erro ao deslogar', error);
    }
  };

  const handleOpenBoardSugestion = () => {
    setModalOpen(true);
  }


  const handleExportBoardToPDF = async (boardId) => {
    const url = `${FRONT_BASE_URL}/board/export/${boardId}`;
    window.open(url, "_blank");

  }

  return (
    <div className="bg-black-custom">
      <Header sairSala={exitBoard} handleOpenBoardSugestion={handleOpenBoardSugestion} />
      {isLoading ?
        <LoaderPage />
        :
        <>
          {!boards ?
            <AlignedContainer>
              <p>Não foi possível carregar os seus Board.</p>
            </AlignedContainer>
            :
            <Container>
              <Button onClick={handleCreateBoard}>Adicionar Board</Button>
              {isLoading ? (
                <LoaderPage />
              ) : (
                <BoardList>
                  {boards.length === 0 ? (
                    <p>Você ainda não possui Boards.</p>
                  ) : (
                    boards.map((board) => (
                      <BoardBox key={board.boardId}>
                        <h6>{board.boardName}</h6>
                        <p>Criado em: {formatdateTime(board.dateTime)}</p>
                        <p>Squad: {board.squadName}</p>
                        <p>Área: {board.areaName}</p>
                        <Actions>
                          <FaRegTrashAlt
                            data-tooltip-id="tooltip-trash"
                            data-tooltip-content="Excluir"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(board.boardId);
                            }} />
                          <Tooltip id="tooltip-trash" style={{ fontSize: "12px", padding: "4px 8px" }} />
                          <FaRegClone
                            data-tooltip-id="tooltip-clone"
                            data-tooltip-content="Clonar"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCloneBoard(board.boardId);
                            }}
                          />
                          <Tooltip id="tooltip-clone" style={{ fontSize: "12px", padding: "4px 8px" }} />
                          <AiOutlineExport
                            data-tooltip-id="tooltip-export"
                            data-tooltip-content="Exportar"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleExportBoardToPDF(board.boardId);
                            }}
                          />
                          <Tooltip id="tooltip-export" style={{ fontSize: "12px", padding: "4px 8px" }} />
                          <FaRegFolderOpen
                            data-tooltip-id="tooltip-open"
                            data-tooltip-content="Abrir"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenBoard(board.boardId);
                            }}
                          />
                          <Tooltip id="tooltip-open" style={{ fontSize: "12px", padding: "4px 8px" }} />
                        </Actions>
                      </BoardBox>
                    ))
                  )}
                </BoardList>
              )}
            </Container>}
        </>}
      {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
    </div>
  );
};

// Estilização com Styled Components
const Container = styled.div`
  padding: 20px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4caf50; 
  color: #fff;
  border: none;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
`;

const BoardList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-evenly;
  align-items: center;
`;

const BoardBox = styled.div`
  background-color: #1E3A5F; /* Azul escuro para o fundo do box */
  color: #FFFFFF; /* Cor do texto branca para contraste */
  padding: 20px;
  border-radius: 12px; /* Bordas mais suaves */
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); /* Sombra mais sutil */
  transition: transform 0.2s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  cursor: pointer; /* Garante que o cursor mude para a mãozinha */
  width: 350px; /* Largura fixa definida */
  height: 199px; 

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.25); /* Aumenta a sombra ao passar o mouse */
    background-color: #27496D; /* Tom de azul ligeiramente mais claro no hover */
  }

  &:active {
    transform: scale(0.98);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* Reduz a sombra ao clicar */
  }

  h3 {
    font-size: 1.5em;
    font-weight: 600; /* Texto principal mais destacado */
    margin-bottom: 10px;
    color: #FFFFFF; /* Mantém o texto principal branco */
  }

  p {
    font-size: 1em;
    margin: 5px 0;
    color: #B0C4DE; /* Azul claro para texto secundário */
    line-height: 1.4; /* Melhor espaçamento entre linhas */
  }

  @media (max-width: 768px) {
    /* Estilo para dispositivos menores */
    padding: 15px;
    width: 250px; 
    h3 {
      font-size: 1.3em;
    }
    p {
      font-size: 0.9em;
    }
  }
`;


const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  font-size: 21px;
  cursor: pointer;

  svg {
    color: #A9A9A9;

   &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 1, 0.9);
    }
  }
`;

const AlignedContainer = styled.div`
  display: flex;
  flex-direction: column;  /* Alinha os itens em uma coluna */
  margin-top: 30px;
  justify-content: top; /* Centraliza verticalmente */
  align-items: center;     /* Centraliza o conteúdo horizontalmente */
  height: 100vh;           /* Faz o contêiner ocupar toda a altura da tela */
`;


export default BoardListPage;
