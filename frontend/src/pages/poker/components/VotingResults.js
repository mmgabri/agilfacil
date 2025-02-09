import React from 'react';
import styled from 'styled-components';

const VotingResults = ({ roomData, cards }) => {

  const groupedByVote = roomData.users.reduce((acc, user) => {
    if (!acc[user.vote]) {
      acc[user.vote] = [];
    }
    acc[user.vote].push(user);
    return acc;
  }, {});

  const results = [];

  cards.forEach(card => {
    const usersWithVote = groupedByVote[card] || [];
    const numberOfUsersWithVote = usersWithVote.length;

    if (numberOfUsersWithVote !== 0) {
      if (card !== "?") {
        let result = { label: card, value: numberOfUsersWithVote, sumValue: card * numberOfUsersWithVote }
        results.push(result)
      } else {
        let result = { label: card, value: numberOfUsersWithVote, sumValue: 0 }
        results.push(result)
      }
    }

    results.sort((a, b) => b.value - a.value);
  });


  const averageVotes = () => {

    const numberOfUsersWithVoteInterrogacao = totalInterrogacao(results)

    const totalValue = results.reduce((accumulator, item) => accumulator + item.sumValue, 0);
    let totalVotation = (results.reduce((accumulator, item) => accumulator + item.value, 0)) - numberOfUsersWithVoteInterrogacao;

    if (totalValue > 0) {
      return (totalValue / totalVotation).toFixed(2)
    } else {
      return ""
    }
  }

  const totalInterrogacao = (results) => {

    const groupedByVote = roomData.users.reduce((acc, user) => {
      if (!acc[user.vote]) {
        acc[user.vote] = [];
      }
      acc[user.vote].push(user);
      return acc;
    }, {});


    const usersWithVote = groupedByVote["?"] || [];
    return usersWithVote.length;
  }

  return (

    <ModalContainer>
      <ModalContent>
        <ResultsContainer>
          <ResultsHeader>Resultado da votação</ResultsHeader>
          <AverageContainer>
            <AverageLabel>Média dos votos</AverageLabel>
            <AverageValue>{averageVotes()}</AverageValue>
          </AverageContainer>
          <TableTitle>Nota x Quantidade de votos</TableTitle>
          {results.map((result) => (
            <ResultItem key={result.label}>
              <ResultLabel>{result.label}</ResultLabel>
              <ResultValue>{result.value}</ResultValue>
            </ResultItem>
          ))}
        </ResultsContainer>
      </ModalContent>
    </ModalContainer>
  );
};

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #1E3A5F;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0.5rem;
  border: 1px solid #ddd;
  max-width: 100%;
  box-sizing: border-box;
  flex: 1;
  margin-right: -15px;
`;

const ResultsHeader = styled.h2`
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
  color: #FFFFFF;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

const AverageContainer = styled.div`
  background: #E0E0E0 ;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const AverageLabel = styled.p`
  font-size: 1rem;
  color: #2F4F4F;
  margin: 0;
  font-weight: 400;
`;

const AverageValue = styled.p`
  font-size: 1.75rem;
  font-weight: 900;
  color: #10b981;
  margin: 0;
`;

const ResultItem = styled.div`
  background-color: #E0E0E0 ;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin: 0.25rem 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #f1f1f1;
    transform: scale(1.02);
  }
`;

const ResultLabel = styled.span`
  font-size: 1rem;
  color: #2F4F4F;
  background-color: #D3D3D3;  /* Fundo cinza claro */
  border: 1px solid #808080;  /* Borda cinza médio */
  padding: 0 0.7rem;  /* Espaçamento interno */
  border-radius: 5px;  /* Bordas arredondadas */
  display: inline-block;  /* Para o tamanho se ajustar ao conteúdo */
`;

const ResultValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #2F4F4F;
`;

const TableTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #FFFFFF;
`;

const ModalContainer = styled.div`
    position: fixed;
    right: 0;
    top: 35px;
    width: 300px;
    height: 500vh;
    background: transparent;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.2);
    padding: 20px;
    z-index: 1000;
    overflow-y: auto;
    align-items: right;
`;

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: right;
    background: transparent;
`;

export default VotingResults;