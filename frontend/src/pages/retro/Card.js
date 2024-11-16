import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: #ffeb3b;
  padding: 10px;
  border-radius: 4px;
  margin: 8px 0;
  cursor: pointer;
`;

const Card = ({ card, handleDragStart, handleDrop }) => {
  return (
    <CardContainer
      draggable
      onDragStart={() => handleDragStart(card)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {card.text}
    </CardContainer>
  );
};

export default Card;
