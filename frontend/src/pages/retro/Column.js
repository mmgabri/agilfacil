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

const Column = ({ column, handleDragStart, handleDrop }) => {
  const handleColumnDrop = (e) => {
    e.preventDefault();  // Previne o comportamento padrão do navegador
    e.stopPropagation(); // Impede a propagação do evento para os elementos pai
    handleDrop(e, null, column);  // Passa o evento e indica que foi solto na coluna
  };

  return (
    <ColumnContainer
      onDragOver={(e) => e.preventDefault()}  // Permite o "drop"
      onDrop={handleColumnDrop}  // Passa o evento para a função handleDrop
    >
      <ColumnTitle>{column.title}</ColumnTitle>
      {column.cards.map((card) => (
        <Card
          key={card.id}
          card={card}
          handleDragStart={handleDragStart}
          handleDrop={(e) => handleDrop(e, card, column)}  // Passa o evento e o card para a função handleDrop
        />
      ))}
    </ColumnContainer>
  );
};

export default Column;
