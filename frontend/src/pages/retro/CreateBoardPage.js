import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { signOut, fetchAuthSession } from '@aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify';
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import { Title } from '../../styles/GenericTitleStyles';
import Header from './HeaderCreateBoard';
import SuggestionForm from '../components/SuggestionForm'
import '../../styles/NotificationPage.css';

const FormContainer = styled.div`
  padding: 20px;
`;

const ColumnWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Input = styled.input`
  margin-right: 8px;
  padding: 5px;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const RemoveIcon = styled(MdOutlineRemoveCircleOutline)`
  cursor: pointer;
  color: #c0c0c0;
  font-size: 35px;
  margin-left: 8px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 8px;
`;

const CheckboxInput = styled.input`
  width: 140px; /* Ajuste do tamanho do checkbox */
  height: 14px;
`;

const CheckboxLabel = styled.label`
  margin: 4px;
  font-size: 800px; /* Tamanho da fonte do label */
  white-space: nowrap; /* Impede a quebra de linha */
  line-height: 1; /* Ajuste para alinhamento vertical */
  font-size: 12px !important; /* Força o tamanho da fonte no label */
  font-weight: normal !important;; /* Impede o texto de ficar em negrito */
`;

export const CreateBoardPage = ({ }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const [board, setBoard] = useState(null);

  const [formData, setFormData] = useState({
    boardName: "",
    areaName: "",
    squadName: "",
    columns: [{ id: uuidv4(), title: "", colorCards: "#F0E68C", cards: [] }]
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [userLoggedData, setUserLoggedData] = useState({});

  useEffect(() => {

    console.log('useEffect - location.state', location.state)

    if (location.state.userLoggedData) {
      setUserLoggedData(location.state.userLoggedData);
    }

    if (location.state.board) {
      setBoard(location.state.board);
      setFormData({
        boardName: location.state.board.boardName,
        areaName: location.state.board.areaName,
        squadName: location.state.board.squadName,
        columns: location.state.board.columns.map(column => ({
          ...column,
          cards: []
        })),
      });
    }

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

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleColumnChange = (e, columnId) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      columns: prevData.columns.map((column) =>
        column.id === columnId ? { ...column, title: value } : column
      )
    }));
  };

  const handleAddColumn = () => {
    const newColumn = {
      id: uuidv4(),
      title: "",
      colorCards: "#F0E68C",
      cards: []
    };
    setFormData((prevData) => ({
      ...prevData,
      columns: [...prevData.columns, newColumn]
    }));
  };

  const handleRemoveColumn = (columnId) => {
    setFormData((prevData) => ({
      ...prevData,
      columns: prevData.columns.filter((col) => col.id !== columnId)
    }));
  };


  const exitBoard = async () => {
    try {
      await signOut(); // Chamando o signOut diretamente
      //window.location.href = 'https://accounts.google.com/Logout';
      console.log('Usuário desconectado com sucesso!');
      //window.location.href = '/'; // Ou use o useNavigate se preferir navegação sem recarregar a página
    } catch (error) {
      console.error('Erro ao deslogar', error);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault()

    const token = await getToken()

    try {
      const response = await axios.post(SERVER_BASE_URL + '/retro/createBoard', { creatorId: userLoggedData.userId, boardName: formData.boardName, squadName: formData.squadName, areaName: formData.areaName, columns: formData.columns }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      console.log('response --> ', response.data)
      navigate('/board', { state: { boardData: response.data, userLoggedData: userLoggedData } });
    } catch (error) {
      console.log("Resposta da api com erro:", error, error.response?.status)
      triggerError(error.response?.status)
    }
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


  const handleOpenSugestion = () => {
    setModalOpen(true);
  }

  const handleKeepCardsChange = (columnId, isChecked) => {
    console.log('handleKeepCardsChange', columnId, isChecked);
    console.log('antes: ', formData)

    setFormData((prevFormData) => ({
      ...prevFormData,
      columns: prevFormData.columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            cards: isChecked
              ? board.columns.find(c => c.id === columnId)?.cards || []
              : []
          };
        }
        return column;
      })
    }));
  };


  return (
    <div className="bg-black-custom">
      <Header sairSala={exitBoard} handleOpenSugestion={handleOpenSugestion} />
      <div className="form-container">
        <Title>Preencha os campos abaixo para criar o Board interativo</Title>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="boardName">Nome do Borad*</label>
            <input
              type="text"
              id="boardName"
              name="boardName"
              value={formData.boardName}
              onChange={handleFieldChange}
              placeholder="Digite o nome do board"
              required
              maxLength={30}
            />
          </div>
          <div className="form-group">
            <label htmlFor="squadName">Squad</label>
            <input
              type="text"
              id="squadName"
              name="squadName"
              value={formData.squadName}
              onChange={handleFieldChange}
              placeholder="Digite o nome da squad"
              maxLength={30}
            />
          </div>
          <div className="form-group">
            <label htmlFor="areaName">Área</label>
            <input
              type="text"
              id="areaName"
              name="areaName"
              value={formData.areaName}
              onChange={handleFieldChange}
              placeholder="Digite o nome da área (comunidade, gerência, etc)"
              maxLength={30}
            />
          </div>
          <div className="form-group">
            <label>Colunas do board *</label>
            {formData.columns.map((column, index) => (
              <div key={column.id} style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <input
                  type="text"
                  placeholder={`Título da Coluna ${index + 1}`}
                  value={column.title}
                  onChange={(e) => handleColumnChange(e, column.id)}
                  required
                  style={{ marginRight: 8 }}
                />
                <RemoveIcon onClick={() => handleRemoveColumn(column.id)} />
                {board &&
                  <CheckboxWrapper>
                    <input
                      type="checkbox"
                      onChange={(e) => handleKeepCardsChange(column.id, e.target.checked)}
                    />
                    <CheckboxLabel>Manter cards</CheckboxLabel>
                  </CheckboxWrapper>}
              </div>
            ))}
            <IoIosAddCircleOutline
              onClick={handleAddColumn}
              style={{
                cursor: "pointer",
                color: "#C0C0C0",
                fontSize: "35px",
                marginTop: 8
              }}
            />
          </div>
          <button type="submit" className="submit-button">
            Criar Board
          </button>
        </form>
      </div>
      {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
    </div>
  );
};
export default CreateBoardPage 