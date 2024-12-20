import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { createUseStyles } from "react-jss";
import { colors } from "@atlaskit/theme";
import { DragDropContext } from "react-beautiful-dnd";
import Columns from "./Columns";
import { reorderboardData, processCombine } from "./FunctionsRetro";
import Header from './HeaderBoard';
import SuggestionForm from '../components/SuggestionForm'
import 'react-toastify/dist/ReactToastify.css';
import './retro.css';

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
    overflow: "auto", // Faz com que a altura da coluna se ajuste conforme o conteúdo
  }
  
});



export const BoardPage = ({ }) => {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const location = useLocation();
  const [boardData, setBoardData] = useState({ columns: [] });
  const cl = useStyles();
  const handleShowInvite = () => setShowInvite(true);
  const handleCloseInvite = () => setShowInvite(false);


  useEffect(() => {
    console.log("useEffect-principal==>", location.state.boardData);
    setBoardData(location.state.boardData);
  }, []);

  // Função de manuseio do fim do arraste
  const onDragEnd = (result) => {
    console.log('--- onDragEnd ---')
    console.log('result', result);

    const { source, destination, combine } = result;

    if (destination) {
      const updatedColumns = reorderboardData(boardData, source, destination);
      setBoardData({ ...boardData, columns: updatedColumns });
    } else if (combine) {
      const updatedColumns = processCombine(boardData, source, combine);
      setBoardData({ ...boardData, columns: updatedColumns });
    }

  };

  const sairSala = e => {
    navigate('/');
  }

  const handleOpen = () => {
    setModalOpen(true);
  }


  return (
    <div className="bg-black-custom">
      <Header boardName={boardData.boardName} handleShowInvite={handleShowInvite} handleCloseInvite={handleCloseInvite} sairSala={sairSala} handleOpen={handleOpen} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={cl.root}>
          {boardData.columns.map((column) => (
            <div key={column.id} className={cl.column}>
              <Columns
                title={column.title}
                listId={column.id}
                listType="card"
                cards={column.cards}
                isCombineEnabled={true}
              />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default BoardPage;