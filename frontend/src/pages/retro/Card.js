import React, { useState } from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: #ffeb3b;
  padding: 10px;
  border-radius: 4px;
  margin: 8px 0;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease;
  ${({ isOverlapping, isDragging }) => `
    box-shadow: ${isOverlapping ? '0 6px 12px rgba(0, 0, 0, 0.3)' : isDragging ? '0 8px 16px rgba(0, 0, 0, 0.4)' : 'none'};
    transform: ${isOverlapping ? 'scale(1.15)' : isDragging ? 'rotate(3deg) scale(1.1)' : 'scale(1.0)'};
    background-color: ${isOverlapping ? '#ffcc80' : '#ffeb3b'};
    border: ${isDragging ? '2px dashed #ffa726' : 'none'};
  `}
`;

const Card = ({ card, handleDragStart, handleDrop, onDragEnter, onDragLeave, isOverlapping }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStartInternal = () => {
    setIsDragging(true);
    handleDragStart(card);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDropEvent = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleDrop(e, card);
  };

  return (
    <CardContainer
      draggable
      onDragStart={handleDragStartInternal}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDropEvent}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      isOverlapping={isOverlapping}
      isDragging={isDragging}
      key={card.id}
      id={`card-${card.id}`}
    >
      <div dangerouslySetInnerHTML={{ __html: card.text }} />
    </CardContainer>
  );
};

export default Card;
