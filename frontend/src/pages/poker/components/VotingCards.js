import { React, useState } from 'react';
import { CardSelected, Card, Title, Container, CardList } from '../../../styles/VotingCardsStyles';

const VotingCards = ({ onCardClick, nota, cards }) => {

    return (
        <Container>
            <CardList>
                {cards.map((card, index) => (
                    card === nota
                        ? <CardSelected key={index} onClick={() => onCardClick(card)}>
                            {card}
                        </CardSelected>
                        : <Card key={index} onClick={() => onCardClick(card)}>
                            {card}
                        </Card>
                ))}
            </CardList>
        </Container>
    );
};

export default VotingCards;
