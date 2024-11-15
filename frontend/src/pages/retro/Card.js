import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: #ffeb3b;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  cursor: grab;
  width: 150px;
  margin: 10px;
  font-size: 14px;
  font-family: 'Arial', sans-serif;
`;

const Card = ({ text, id }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'CARD',
    item: { id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <CardContainer ref={drag} style={{ opacity: isDragging ? 0.5 : 1 }}>
      {text}
    </CardContainer>
  );
};

export default Card;
