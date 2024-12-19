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
    padding: 16,
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  column: {
    margin: "0 8px"
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