import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  
  z-index: 9999;
  `;

export const ModalContent = styled.div`
  background-color: #2c2c2c;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-width: 90%;
  `;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-weight: bold;
  float: right;
  color: #C0C0C0
  `;