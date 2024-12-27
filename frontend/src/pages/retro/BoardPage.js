import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom'
import { createUseStyles } from "react-jss";
import { DragDropContext } from "react-beautiful-dnd";
import Columns from "./Columns";
import { reorderboardData, processCombine, saveCard, deleteCard, updateLike, updateTitleColumn, deleteColumn, addCard } from "./FunctionsRetro";
import Header from './HeaderBoard';
import { useSocket } from "../../customHooks/useSocket";
import 'react-toastify/dist/ReactToastify.css';
import './retro.css';

export const BoardPage = ({ }) => {
  let navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const location = useLocation();
  const [boardData, setBoardData] = useState({ columns: [] });
  const cl = useStyles();
  const handleShowInvite = () => setShowInvite(true);
  const handleCloseInvite = () => setShowInvite(false);

  const { socketResponse, addCardSocket, reorderBoardSocket, combineCardSocket, updateTitleColumnSocket, updateLikeSocket, deleteCardSocket, saveCardSocket, deleteColumnSocket } = useSocket(location.state.userName, location.state.userId, location.state.boardData.boardId, 'retro')


  useEffect(() => {
    setBoardData(location.state.boardData);
  }, []);


  useEffect(() => {
//    console.log('useEffect - socketResponse ==>', socketResponse);

    if (socketResponse && socketResponse.boardId) {
      setBoardData(prevBoardData => ({
        ...prevBoardData,
        ...socketResponse, // Garante que as novas referências sejam criadas
      }));
      console.log('Board atualizado com socketResponse:', socketResponse);
    } else {
      console.error('socketResponse inválido', socketResponse);
    }
  }, [socketResponse]);


  const onDragEnd = (result) => {
    console.log('--- onDragEnd ---')
    console.log('result', result);

    const { source, destination, combine } = result;

    if (destination) {
      reorderBoardSocket({ source, destination })
      const updatedColumns = reorderboardData(boardData, source, destination);
      setBoardData({ ...boardData, columns: updatedColumns });
    } else if (combine) {
      combineCardSocket({source, combine})
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

  const onSaveCard = (content, indexCard, indexColumn) => {
    const updatedColumns = saveCard(boardData, content, indexCard, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    saveCardSocket({content:content, indexCard:indexCard, indexColumn:indexColumn})
  };

  const onDeleteCard = (indexCard, indexColumn) => {
    const updatedColumns = deleteCard(boardData, indexCard, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    deleteCardSocket({indexCard:indexCard, indexColumn:indexColumn})
  };

  const onUpdateLike = (isIncrement, indexCard, indexColumn) => {
    const updatedColumns = updateLike(boardData, isIncrement, indexCard, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    updateLikeSocket({isIncrement:isIncrement, indexCard:indexCard, indexColumn:indexColumn})
  };

  const onUpdateTitleColumn = (content, index) => {
    const updatedColumns = updateTitleColumn(boardData, content, index);
    setBoardData({ ...boardData, updatedColumns });
    updateTitleColumnSocket({content:content, index:index})
  };

  const onDeleteColumn = (index) => {
    console.log('onDeleteColumn', index)
    const updatedColumns = deleteColumn(boardData, index);
    setBoardData({ ...boardData, updatedColumns });
    deleteColumnSocket({index:index})
  };

  const onAddCard = (newCard, indexColumn) => {
    const updatedColumns = addCard(boardData, newCard, indexColumn);
    setBoardData({ ...boardData, updatedColumns });
    addCardSocket({ newCard: newCard, indexColumn: indexColumn })
  };

  return (
    <div className="bg-black-custom">
      <Header boardName={boardData.boardId} handleShowInvite={handleShowInvite} handleCloseInvite={handleCloseInvite} sairSala={sairSala} handleOpen={handleOpen} />
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={cl.root}>
          {boardData.columns.map((column, index) => (
            <div key={column.id} className={cl.column}>
              <Columns
                title={column.title}
                listId={column.id}
                listType="card"
                cards={column.cards}
                isCombineEnabled={true}
                onSaveCard={onSaveCard}
                onDeleteCard={onDeleteCard}
                onUpdateLike={onUpdateLike}
                onUpdateTitleColumn={onUpdateTitleColumn}
                onDeleteColumn={onDeleteColumn}
                onAddCard={onAddCard}
                indexColumn={index}
              />
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

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

});
