import React from 'react';
import { useDrop } from 'react-dnd';
import styled from 'styled-components';
import Card from './Card';

const ColumnContainer = styled.div`
  background-color: #f1f1f1;
  padding: 20px;
  border-radius: 8px;
  min-width: 250px;
  margin: 10px;
  height: 500px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
`;

const ColumnTitle = styled.h3`
  text-align: center;
  color: #333;
`;

const Column = ({ id, title, cards, moveCard }) => {
  const [, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item) => moveCard(item.id, id),
  }));

  return (
    <ColumnContainer ref={drop}>
      <ColumnTitle>{title}</ColumnTitle>
      {cards.map((card) => (
        <Card key={card.id} id={card.id} text={card.text} />
      ))}
    </ColumnContainer>
  );
};

export default Column;
