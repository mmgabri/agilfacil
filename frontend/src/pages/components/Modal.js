import React, { useEffect, useRef } from 'react';
import { ModalOverlay, ModalContent,CloseButton  } from '../../styles/ModalStyles';

const Modal = ({ onClose, children }) => {
  const modalRef = useRef(null); // Referência para o contêiner do modal

  // Fechar o modal se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); 
      }
    };

    // Adiciona o listener de evento
    window.addEventListener('mousedown', handleClickOutside);
    
    // Limpeza do listener de evento na desmontagem do componente
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]); // Dependência do onClose para garantir que o hook se comporte corretamente


  return (
    <ModalOverlay>
       <ModalContent ref={modalRef}>
        <CloseButton onClick={onClose}>X</CloseButton>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};

export default Modal;