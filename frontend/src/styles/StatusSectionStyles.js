import styled from 'styled-components';


// Status Container
export const StatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #1C1C1C;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  width: 100%;
  text-align: center;
  margin-top: 0.2rem;
  margin-bottom: 0.0rem;
`;

// Status
export const Status = styled.div`
  font-size: 1rem;
  color: #66CDAA;
  margin-bottom: 0.75rem;
  font-weight: 500;
`;

// Botão de Comando
// Botão de Comando
// Botão de Comando
export const CommandButton = styled.button`
  background-color: #007bff; /* Azul claro */
  color: #ffffff; /* Cor da fonte */
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #0056b3; /* Azul escuro no hover */
    transform: scale(1.05);
  }

  &:active {
    background-color: #003d7a; /* Azul mais escuro ao clicar */
    color: #e0e0e0; /* Cor da fonte ao clicar */
  }
`;

