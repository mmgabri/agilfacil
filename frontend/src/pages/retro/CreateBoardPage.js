import React, { useState, useEffect } from "react";
import axios from "axios";
import { signOut} from '@aws-amplify/auth';
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

export const CreateBoardPage = ({ }) => {
  let navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    boardName: "",
    areaName: "",
    squadName: "",
    columns: [{ id: uuidv4(), title: "", colorCards: "#F0E68C", cards: [] }]
  });
  const [isModalOpen, setModalOpen] = useState(false);
  const [userLoggedData, setUserLoggedData] = useState({});

  useEffect(() => {

    console.log('useEffect - location.state.userLoggedData', location.state.userLoggedData)

    if (location.state.userLoggedData) {
      setUserLoggedData(location.state.userLoggedData);
    }

  }, []);

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
      window.location.href = 'https://accounts.google.com/Logout';
      console.log('Usuário desconectado com sucesso!');
      window.location.href = '/'; // Ou use o useNavigate se preferir navegação sem recarregar a página
    } catch (error) {
      console.error('Erro ao deslogar', error);
    }
  };

  const handleSubmit = e => {
    console.log('userLoggedData', userLoggedData)
    e.preventDefault()

    console.log('formData ==>', formData)

    axios
      .post(SERVER_BASE_URL + '/retro/createBoard', {
        creatorId: userLoggedData.userId,
        boardName: formData.boardName,
        squadName: formData.squadName,
        areaName: formData.areaName,
        columns: formData.columns
      })
      .then(response => {
        // console.log('response ==> ', response)
        //  console.log('userLoggedData', userLoggedData)
        navigate('/board', { state: { boardData: response.data, userLoggedData: userLoggedData } });
      })
      .catch((error) => {
        console.log("Resposta da api com erro:", error, error.response?.status)
        triggerError()
      });
  }

  const triggerError = (statusCode) => {
    let message = 'Ocorreu um erro inesperado. Por favor, tente novamente.'

    if (statusCode == 404) {
      message = 'Sala inexistente. Por favor, peça um novo ID e tente novamente.'
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

  const handleAbout = () => {
    navigate("/about")
  }

  const handleHome = () => {
    navigate("/")
  }

  const handleOpenSugestion = () => {
    setModalOpen(true);
  }


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
                <MdOutlineRemoveCircleOutline
                  onClick={() => handleRemoveColumn(column.id)}
                  style={{
                    cursor: "pointer",
                    color: "#C0C0C0",
                    fontSize: "35px",
                    marginLeft: "8px"
                  }}
                />
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