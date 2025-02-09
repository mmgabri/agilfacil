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
        <ResultsContainer>
            <ResultsHeader>Resultado da votação</ResultsHeader>
            <AverageContainer>
                <AverageLabel>Média dos votos</AverageLabel>
                <AverageValue>{averageVotes()}</AverageValue>
            </AverageContainer>
            <TableTitle>Nota x Quantidade</TableTitle>
            {results.map((result) => (
                <ResultItem key={result.label}>
                    <ResultLabel>{result.label}</ResultLabel>
                    <ResultValue>{result.value}</ResultValue>
                </ResultItem>
            ))}
        </ResultsContainer>
    );
};

export const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #282c34;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 0.5rem;
  border: 1px solid #ddd;
  max-width: 100%;
  box-sizing: border-box;
  flex: 1;
`;

export const ResultsHeader = styled.h2`
  margin-bottom: 0.75rem;
  font-size: 1.3rem;
  color: #C0C0C0;
  text-align: center;
  font-weight: 600;
  letter-spacing: 0.5px;
`;

export const AverageContainer = styled.div`
  background: #C0C0C0;
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

export const AverageLabel = styled.p`
  font-size: 1rem;
  color: #666;
  margin: 0;
  font-weight: 400;
`;

export const AverageValue = styled.p`
  font-size: 1.75rem;
  font-weight: 900;
  color: #007bff;
  margin: 0;
`;

export const ResultItem = styled.div`
  background-color: #C0C0C0;
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

export const ResultLabel = styled.span`
  font-size: 1rem;
  color: #555;
`;

export const ResultValue = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
`;

export const TableTitle = styled.h3`
  margin-bottom: 0.5rem;
  font-size: 0.8rem;
  color: #C0C0C0;
`;

export default VotingResults;