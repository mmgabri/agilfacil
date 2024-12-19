import React from 'react';
import { ResultsContainer, ResultsHeader, AverageContainer, AverageLabel, AverageValue, ResultItem, ResultLabel, ResultValue, TableTitle } from '../../../styles/VotingResultsStyles';

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

export default VotingResults;
