import React from 'react';
import Card from './Card';
import styled from 'styled-components';

const ColumnContainer = styled.div`
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
  min-width: 200px;
  margin: 10px;
`;

const ColumnTitle = styled.h3`
  text-align: center;
  color: #333;
`;

const Column = ({ column, handleDragStart, handleDrop, handleColumnDrop }) => {
  return (
    <ColumnContainer
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleColumnDrop}
    >
      <ColumnTitle>{column.title}</ColumnTitle>
      {column.cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          handleDragStart={handleDragStart}
          handleDrop={() => handleDrop(card)}
        />
      ))}
    </ColumnContainer>
  );
};

export default Column;
