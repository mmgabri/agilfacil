import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Column from './Column';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  flex-wrap: wrap;
`;

const Board = () => {
  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      title: 'Todo',
      cards: [
        { id: 'card-1', text: 'Card 1' },
        { id: 'card-2', text: 'Card 2' },
      ],
    },
    {
      id: 'column-2',
      title: 'Doing',
      cards: [
        { id: 'card-3', text: 'Card 3' },
        { id: 'card-4', text: 'Card 4' },
      ],
    },
    {
      id: 'column-3',
      title: 'Done',
      cards: [
        { id: 'card-5', text: 'Card 5' },
        { id: 'card-6', text: 'Card 6' },
      ],
    },
  ]);

  const moveCard = (cardId, targetColumnId) => {
    const sourceColumnIndex = columns.findIndex((col) =>
      col.cards.some((card) => card.id === cardId)
    );
    const sourceColumn = columns[sourceColumnIndex];
    const targetColumnIndex = columns.findIndex((col) => col.id === targetColumnId);
    const targetColumn = columns[targetColumnIndex];

    const cardToMove = sourceColumn.cards.find((card) => card.id === cardId);

    // Remove o card da coluna de origem
    sourceColumn.cards = sourceColumn.cards.filter((card) => card.id !== cardId);

    // Adiciona o card na coluna de destino
    targetColumn.cards.push(cardToMove);

    // Atualiza o estado das colunas
    setColumns([...columns]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <BoardContainer>
        {columns.map((column) => (
          <Column
            key={column.id}
            id={column.id}
            title={column.title}
            cards={column.cards}
            moveCard={moveCard}
          />
        ))}
      </BoardContainer>
    </DndProvider>
  );
};

export default Board;
