import React, { useState, useEffect } from "react";
import axios from "axios";
import { signOut, fetchAuthSession } from '@aws-amplify/auth';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useLocation } from 'react-router-dom'
import { emitMessage } from '../../services/utils'
import 'react-toastify/dist/ReactToastify.css';
import { SERVER_BASE_URL } from "../../constants/apiConstants";
import Header from './componentes/HeaderCreateBoard';
import SuggestionForm from '../components/SuggestionForm'
import { FormContainer, Title, FormGroup, CheckboxLabel, CheckboxWrapper, StyledForm, SubmitButton, RemoveIcon, AddColumnIcon } from '../../styles/FormStyle'

export const CreateBoardPage = ({ }) => {
  let navigate = useNavigate();
  const location = useLocation();
  const [board, setBoard] = useState(null);

  const [formData, setFormData] = useState({
    boardName: "",
    areaName: "",
    squadName: "",
    columns: [{ id: uuidv4(), title: "", colorCards: "#F0E68C", isObfuscated: false, cards: [] }]
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [userAuthenticated, setUserAuthenticated] = useState({});

  useEffect(() => {
    //console.log('useEffect - location.state', location.state)

    const initializeUserData = async () => {
      try {
        setUserAuthenticated(location.state.userAuthenticated)

      } catch (error) {
        emitMessage('error', 999)
      }
    };

    if (!location.state.userAuthenticated) {
      emitMessage('error', 999, 4000)
      return
    }

    initializeUserData();

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
      isObfuscated: false,
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
      await signOut();
    } catch (error) {
      emitMessage('error', 999)
    }
  };

  const handleSubmit = async e => {
    e.preventDefault()

    const token = await getToken()

    try {
      const response = await axios.post(SERVER_BASE_URL + '/board/createBoard', { creatorId: userAuthenticated.userId, userName: userAuthenticated.userName, boardName: formData.boardName, squadName: formData.squadName, areaName: formData.areaName, columns: formData.columns }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      navigate('/board', { state: { boardData: response.data, userAuthenticated: userAuthenticated } });
    } catch (error) {
      emitMessage('error', 906, 3000)
    }
  }



  const handleOpenSugestion = () => {
    setModalOpen(true);
  }

  const handleKeepCardsChange = (columnId, isChecked) => {

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
      <FormContainer>
        <Title>Preencha os campos abaixo para criar o Board interativo</Title>
        <StyledForm onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="boardName">Nome do Board*</label>
            <input
              type="text"
              id="boardName"
              name="boardName"
              value={formData.boardName}
              onChange={handleFieldChange}
              placeholder="Digite o nome do board"
              required
              maxLength={55}
            />
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
          <FormGroup>
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
          </FormGroup>
          <FormGroup>
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
                {board && (
                  <CheckboxWrapper>
                    <input
                      type="checkbox"
                      onChange={(e) => handleKeepCardsChange(column.id, e.target.checked)}
                    />
                    <CheckboxLabel>Manter cards</CheckboxLabel>
                  </CheckboxWrapper>
                )}
              </div>
            ))}
            <AddColumnIcon onClick={handleAddColumn} />
          </FormGroup>
          <SubmitButton type="submit">Criar Board</SubmitButton>
        </StyledForm>
      </FormContainer>
      {isModalOpen && <SuggestionForm onClose={() => setModalOpen(false)} />}
    </div>

  );
};
export default CreateBoardPage 