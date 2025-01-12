import React, { useEffect, useState } from 'react';
import axios from "axios";
import { toast } from 'react-toastify';
import { signOut, getCurrentUser, fetchUserAttributes, fetchAuthSession } from '@aws-amplify/auth';
import { useNavigate } from 'react-router-dom'
import { FaTrash, FaEye } from 'react-icons/fa';
import { FaRegFolderOpen } from "react-icons/fa";
import styled from 'styled-components';
import Header from './HeaderCreateBoard';
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import LoaderPage from '../generic/LoaderPage';

const BoardListPage = () => {
  let navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [userLoggedData, setuserLoggedData] = useState({});

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        // Obtem Usuário Logado     
        const user = await getCurrentUser();
        const attributes = await fetchUserAttributes(user);

        // Salva dados do usuário no contexto
        const userData = {
          userId: attributes.sub,
          userName: attributes.name,
          isBoardCreator: true
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
            //console.log('response ==> ', response)
            setBoards(response.data);
            setIsLoading(false);

          })
          .catch((error) => {
            console.log("Resposta da api com erro:", error, error.response?.status)
            triggerError()
          });


        //console.log('Atributos do usuário:', attributesObject);
        //return attributesObject
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


  const handleDelete = (id) => {
    setBoards(boards.filter(board => board.id !== id));
  };

  const handleOpen = async (boardId) => {
    const token = await getToken()

    axios
      .get(`${SERVER_BASE_URL}/retro/${boardId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      .then(response => {
        console.log('response ==> ', response)
        navigate('/board', { state: { boardData: response.data, userLoggedData: userLoggedData } });
      })
      .catch((error) => {
        console.log("Resposta da api com erro:", error, error.response?.status)
        triggerError(error.response?.status)
      });

  };

  const handleAddBoard = () => {
    navigate('/board/create', { state: { userLoggedData: userLoggedData } });
  };

  const exitBoard = async () => {
    try {
      await signOut(); // Chamando o signOut diretamente
      console.log('Usuário desconectado com sucesso!');
      window.location.href = '/'; // Ou use o useNavigate se preferir navegação sem recarregar a página
    } catch (error) {
      console.error('Erro ao deslogar', error);
    }
  };

  const handleOpenSugestion = () => {
    setModalOpen(true);
  }

  const triggerError = (statusCode) => {
    let message = 'Ocorreu um erro inesperado. Por favor, tente novamente.'

    if (statusCode == 404) {
      message = 'Sala inexistente. Por favor, peça um novo ID e tente novamente.'
    }

    if (statusCode == 401) {
      message = 'Acesso negado. Faça um novo login e tente novamente.'
    }

    toast.error(message, {
      position: 'top-center', // Usando string para a posição
      autoClose: 8000, // Fecha automaticamente após 8 segundos
      hideProgressBar: false,
      closeButton: true, // Mostra o botão de fechar
      draggable: true, // Permite arrastar a notificação
      pauseOnHover: true, // Pausa o fechamento automático ao passar o mouse
    });
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do zero
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  return (
    <div className="bg-black-custom">
      <Header sairSala={exitBoard} handleOpenSugestion={handleOpenSugestion} />
      <Container>
        <Button onClick={handleAddBoard}>Adicionar Board</Button>
        {isLoading ? (
          <LoaderPage />
        ) : (
          <BoardList>
            {boards.length === 0 ? (
              <p>Você ainda não possui Boards.</p>
            ) : (
              boards.map((board) => (
                <BoardBox key={board.boardId} onClick={() => handleOpen(board.boardId)}>
                  <h3>{board.boardName}</h3>
                  <p>Criado em: {board.dateTime}</p>
                  <p>Squad: {board.squadName}</p>
                  <p>Área: {board.areaName}</p>
                  <Actions>
                    <FaTrash onClick={(e) => {
                      e.stopPropagation(); // Impede que o clique no ícone de exclusão acione o `onClick` do BoardBox
                      handleDelete(board.boardId);
                    }} />
                    <FaRegFolderOpen
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que o clique no ícone de abrir acione o onClick geral
                        handleOpen(board.boardId);
                      }}
                    />
                  </Actions>
                </BoardBox>

              ))
            )}
          </BoardList>
        )}
      </Container>
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
  gap: 20px;
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
  margin-top: 10px;
  font-size: 20px;
  cursor: pointer;

  svg {
    color: #A9A9A9;

   &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 0, 1, 0.9);
    }
  }
`;

export default BoardListPage;
