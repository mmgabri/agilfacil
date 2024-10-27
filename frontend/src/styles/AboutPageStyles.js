import styled from 'styled-components';

export const Container = styled.div`
max-width: 1200px; /* Aumenta a largura máxima */
  width: 75%; /* Garante que ocupe 90% da tela */
  margin: 20px auto; /* Ajusta o espaçamento superior e inferior */
  padding: 10px; /* Adiciona mais espaçamento interno */
  background-color: #1C1C1C;
  border-radius: 12px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Deixa a sombra mais evidente */
  min-height: 600px; /* Define uma altura mínima */
  display: flex;
  flex-direction: column;
  text-align: justify;
  justify-content: center;
`;

export const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 20px;
  color: #C0C0C0;
  text-align: center;
  font-weight: 700;
`;

export const Paragraph = styled.p`
  line-height: 1.8;
  font-size: 18px;
  color: #C0C0C0;
  margin-bottom: 20px;
`;

export const List = styled.ul`
  margin-top: 20px;
  padding-left: 20px;
`;

export const ListItem = styled.li`
  margin-bottom: 10px;
  font-size: 18px;
  color: #C0C0C0;
  font-weight: 500;
`;
