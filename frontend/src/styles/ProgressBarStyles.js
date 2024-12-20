import styled from 'styled-components';

// Estilização do contêiner da barra de progresso
export const ProgressContainer = styled.div`
  width: 100%;
  max-width: 600px; /* Ajuste o valor conforme necessário */
  background-color: #e0e0e0;
  border-radius: 8px;
  overflow: auto;
  margin: 1rem auto; /* Centraliza o contêiner horizontalmente */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.0rem;
  margin-top: 0.0rem;
`;

// Estilização da barra de progresso
export const ProgressBar = styled.div`
  height: 30px;
  background-color: #4caf50;
  text-align: center;
  line-height: 30px; /* Centraliza o texto verticalmente */
  color: white;
  font-weight: bold;
  border-radius: 8px 0 0 8px; /* Canto arredondado no lado esquerdo */
  transition: width 0.4s ease;
`;

// Estilização do título
export const ProgressTitle = styled.div`
  text-align: center;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

