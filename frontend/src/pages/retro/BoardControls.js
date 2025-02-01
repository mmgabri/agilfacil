import React, { useState } from 'react';
import styled from 'styled-components';
import { FaClock } from 'react-icons/fa';
import { AiOutlineExport } from "react-icons/ai";
import { FaNoteSticky, FaUserPen } from "react-icons/fa6";
import { FaUsers, FaPlay, FaStop, FaPlus } from 'react-icons/fa';
import { MdOutlineBlurCircular } from "react-icons/md";
import InputMask from 'react-input-mask';
import ModalAddCollumn from './ModalAddCollumn';

// Estilização principal do controle do board
const BoardControlsStyled = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
margin-top: 5px;
padding: 0px 10px 0px 10px;
background-color: transparent; // #2c2c2c;
color: #fff;
flex-wrap: wrap; /* Adiciona flexibilidade ao layout */

/* Responsividade para telas menores */
@media (max-width: 768px) {
  flex-direction: column;
  align-items: flex-start;
}
`;


const InfoBox = styled.div`
display: flex; /* Garante que as colunas fiquem lado a lado */
align-items: center; /* Alinha os itens verticalmente */
justify-content: space-between; /* Espaçamento entre colunas */
flex-wrap: nowrap; /* Evita quebra de linha */
background-color: transparent; /* Fundo transparente */
padding: 0px; /* Espaçamento interno */
border-radius: 8px; /* Bordas arredondadas */
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para destacar */

`;


const InfoColumn = styled.div`
display: flex;
flex-direction: column; /* Alinha conteúdo em coluna */
align-items: flex-start; /* Alinha à esquerda */
flex-shrink: 0; /* Evita que a coluna encolha */
margin: 4px; /* Espaçamento entre colunas */
background-color: #2c2c2c; /* Fundo para destacar */
padding: 5px; /* Espaçamento interno */
border-radius: 4px; /* Bordas arredondadas */
box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1); /* Sombra leve */

 transition: transform 0.2s ease-in-out; /* Suaviza a transformação */

&:hover {
  transform: scale(1.1); /* Aumenta o tamanho em 20% */
}
`;


const InfoTitle = styled.div`
display: flex;
align-items: center; /* Garante alinhamento vertical com ícones */
font-size: 14px;
color: #d1d1d1;
margin-top: 0px;
white-space: nowrap; /* Impede quebra de linha */
overflow: hidden; /* Esconde texto extra */
text-overflow: ellipsis; /* Adiciona reticências se necessário */
`;

const InfoIcon = styled.div`
font-size: 16px;
background-color: transparent; /* Fundo transparente */
border-radius: 50%;
padding: 0px;
margin-right: 9px;
color: #aaa;
`;

const InfoCount = styled.div`
font-size: 14px;
color: #d1d1d1; /* Cor para diferenciar do título */
margin-top: 0px; /* Espaçamento entre título e contagem */
text-align: center; /* Centraliza o texto horizontalmente */
align-self: center; /* Centraliza o elemento no eixo horizontal da coluna */
`;


const BoardActions = styled.div`
display: flex;
gap: 10px;
flex-wrap: wrap; /* Adiciona flexibilidade ao layout */

/* Responsividade para telas menores */
@media (max-width: 768px) {
  justify-content: center; /* Centraliza os botões em telas menores */
  width: 100%; /* Ocupa toda a largura disponível */
}
`;

const TimerBox = styled.div`
display: flex;
align-items: center;
justify-content: space-between;
padding: 10px;
background-color: #2c2c2c;
border-radius: 8px;
color: #fff;
gap: 10px;
`;

// Estilo do TimerInput
const TimerInput = styled(InputMask)`
  width: 60px;
  padding: 5px;
  text-align: center;
  font-size: 14px;
  border-radius: 4px;
  border: 1px solid ${({ $isInvalid }) => ($isInvalid ? "red" : "#555")};
  background-color: ${({ $isInvalid }) => ($isInvalid ? "#1C1C1C" : "#1C1C1C")};
  color: #d1d1d1;

  &:disabled {
    background-color: #282c34;
    color: #888;
  }
`;

const TimerControls = styled.div`
display: flex;
gap: 8px;
`;

const TimerIconClock = styled(FaClock)`
font-size: 20px;
color: #d1d1d1;
margin-right: 3px;
`;

const TimerIconStart = styled(FaPlay)`
font-size: 20px;
color: #4169E1;
margin-right: 10px;
transition: transform 0.2s ease-in-out; /* Suaviza a transformação */

&:hover {
  transform: scale(1.3); /* Aumenta o tamanho em 20% */
}
`;
const TimerIconStop = styled(FaStop)`
font-size: 20px;
color: #4169E1;
margin-right: 10px;
transition: transform 0.2s ease-in-out; /* Suaviza a transformação */

&:hover {
  transform: scale(1.3); /* Aumenta o tamanho em 20% */
}
`;

const ActionBox = styled.div`
display: flex;
justify-content: flex-end; /* Alinha os botões à direita */
align-items: center;
gap: 10px;
background-color: transparent; /* Fundo transparente */
padding: 0px;
border-radius: 8px;
box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* Sombra para destaque */

/* Responsividade */
@media (max-width: 768px) {
 justify-content: center; /* Centraliza os botões em telas menores */
 width: 100%;
}
`;


const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 7px;
   background-color: ${(props) => props.color || 'blue'}; 
  color: #fff;
  font-size: 13px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    transform: scale(1.1); /* Aumenta o tamanho em 20% */
  }

  span {
    font-size: 16px;
  }

  /* Responsividade para telas menores */
  @media (max-width: 768px) {
    width: 100%; /* Os botões ocupam toda a largura */
    justify-content: center; /* Centraliza o conteúdo */
    margin-bottom: 10px; /* Espaçamento entre os botões */
  }
`;



const BoardControls = ({ countCard, countUserLogged, countUserWithCard, timeInput, isRunningTimer, handleInputTimerChange, handleStartTimer, handlePauseTimer, handleAddColumn, handleSetIsObfuscated, isObfuscated, isBoardCreator, isInvalidFormat, handleExportBoard }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleModalAddCollmnSubmit = (collunName) => {
    handleAddColumn(collunName)
  }

  return (
    <BoardControlsStyled>
      <ModalAddCollumn
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalAddCollmnSubmit}
      />

      <InfoBox>
        <InfoColumn>
          <InfoTitle>
            <InfoIcon>
              <FaNoteSticky />
            </InfoIcon>
            Todas de Cards
          </InfoTitle>
          <InfoCount>{countCard}</InfoCount>
        </InfoColumn>
        <InfoColumn>
          <InfoTitle>
            <InfoIcon>
              <FaUsers />
            </InfoIcon>
            Participantes Online
          </InfoTitle>
          <InfoCount>{countUserLogged}</InfoCount>
        </InfoColumn>
        <InfoColumn>
          <InfoTitle>
            <InfoIcon>
              <FaUserPen />
            </InfoIcon>
            Participantes com Cards
          </InfoTitle>
          <InfoCount>{countUserWithCard}</InfoCount>
        </InfoColumn>
      </InfoBox>



      <TimerBox>
        <TimerIconClock />

        <TimerInput
          mask="99:99" // Máscara para MM:SS
          maskChar="_" // Caracter padrão de preenchimento
          value={timeInput}
          onChange={handleInputTimerChange}
          disabled={isRunningTimer}
          placeholder="MM:SS"
          $isInvalid={isInvalidFormat}
        />

        <TimerControls>
          {!isRunningTimer && (
            <TimerIconStart onClick={handleStartTimer} />
          )}
          {isRunningTimer && (
            <TimerIconStop onClick={handlePauseTimer} />
          )}
        </TimerControls>
      </TimerBox>

      {isBoardCreator && (
        <BoardActions>
          <ActionBox>
            <ActionButton onClick={() => setModalOpen(true)} color="#1E3A5F">
              <FaPlus /> Incluir Coluna
            </ActionButton>
            <ActionButton onClick={() => handleExportBoard()} color="#1E3A5F">
              <AiOutlineExport /> Exportar Board
            </ActionButton>
            {isObfuscated ?
              (<ActionButton onClick={() => handleSetIsObfuscated(false)} color="#1E3A5F" >
                <MdOutlineBlurCircular /> Revelar Cards
              </ActionButton>)
              :
              (<ActionButton onClick={() => handleSetIsObfuscated(true)} color="#1E3A5F" >
                <MdOutlineBlurCircular /> Ocultar cards
              </ActionButton>)
            }
          </ActionBox>
        </BoardActions>)}


    </BoardControlsStyled>

  );

};

export default BoardControls;
