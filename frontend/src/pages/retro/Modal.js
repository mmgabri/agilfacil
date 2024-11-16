import React from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ModalTitle = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const ModalButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin: 5px;
`;

const Modal = ({ combineCards, cancel, card1, card2 }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalTitle>Juntar Cards</ModalTitle>
        <p><strong>Card 1:</strong> {card1.text}</p>
        <p><strong>Card 2:</strong> {card2.text}</p>
        <p><strong>Texto combinado:</strong> {card1.text} ------- {card2.text}</p>
        <div>
          <ModalButton onClick={combineCards}>Confirmar</ModalButton>
          <ModalButton onClick={cancel}>Cancelar</ModalButton>
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;
