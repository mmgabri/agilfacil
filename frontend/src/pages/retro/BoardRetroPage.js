import React, { useState } from 'react';
import Column from './Column';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const Board = () => {
  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      title: 'Todo',
      cards: [
        { id: 'card-1', text: 'Card 1', column: 'column-1' },
        { id: 'card-2', text: 'Card 2', column: 'column-1' },
      ],
    },
    {
      id: 'column-2',
      title: 'Doing',
      cards: [
        { id: 'card-3', text: 'Card 3', column: 'column-2' },
        { id: 'card-4', text: 'Card 4', column: 'column-2' },
      ],
    },
  ]);

  const [draggedCard, setDraggedCard] = useState(null);

  // Define o card sendo arrastado
  const handleDragStart = (card) => {
    setDraggedCard(card);
  };

  // Ao soltar o card
  const handleDrop = (targetCard) => {
    console.log('------------------------------handleDrop -------------------------------')
    console.log('draggedCard ==>', draggedCard)
    console.log('targetCard ==>', targetCard)
    console.log('----------------------------------')

    if (!draggedCard || draggedCard.id === targetCard.id) return;

    const newColumns = columns.map((column) => {
      const updatedCards = column.cards.map((card) => {
        if (card.id === targetCard.id) {
          // Combina o texto
          return { ...card, text: `${card.text} ------- ${draggedCard.text}` };
        }
        return card;
      }).filter((card) => card.id !== draggedCard.id);

      return { ...column, cards: updatedCards };
    });

    setColumns(newColumns);
    setDraggedCard(null);
  };

  const handleColumnDrop = (targetColumnId) => {
    console.log('------------------------------handleColumnDrop -------------------------------')
    console.log('draggedCard ==>', draggedCard)
    console.log('targetColumnId ==>', targetColumnId)
    console.log('----------------------------------')

    if (draggedCard.column === targetColumnId ) return;

    if (!draggedCard) return;

    draggedCard.column = targetColumnId;

    const updatedColumns = columns.map((column) => {
      if (column.id === draggedCard.columnId) {
        return {
          ...column,
          cards: column.cards.filter((card) => card.id !== draggedCard.id),
        };
      }
      if (column.id === targetColumnId) {
        return {
          ...column,
          cards: [...column.cards, { ...draggedCard }],
        };
      }
      return column;
    });

    setColumns(updatedColumns);
    setDraggedCard(null);
  };


  return (
    <BoardContainer>
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          handleColumnDrop={() => handleColumnDrop(column.id)}
        />
      ))}
    </BoardContainer>
  );
};

export default Board;
