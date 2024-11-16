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
  const handleDropEvent = (e) => {
    e.preventDefault();  // Previne o comportamento padrão do navegador
 //   console.log('Card drop event', e);  // Aqui podemos ver se o evento chega
    handleDrop(e, card);  // Passa o evento e o card
  };

  return (
    <CardContainer
      draggable
      onDragStart={(e) => handleDragStart(card)}  // Passa o card ao iniciar o drag
      onDragOver={(e) => e.preventDefault()}  // Impede o comportamento padrão para permitir o "drop"
      onDrop={handleDropEvent}  // Passa o evento para a função handleDrop
      key={card.id}
      id={`card-${card.id}`}
    >
      {card.text}
    </CardContainer>
  );
};

export default Card;
