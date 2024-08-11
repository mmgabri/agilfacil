import { React, useState } from 'react';
import { CardSelected, Card, Title, Container, CardList } from '../../styles/VotingCardsStyles';

const VotingCards = ({ onCardClick, nota, cards }) => {

    return (
        <Container>
            <CardList>
                {cards.map((card) => (
                    <>
                        {card == nota
                            ? <CardSelected key={card} onClick={() => onCardClick(card)}>
                                {card}
                            </CardSelected>
                            : <Card key={card} onClick={() => onCardClick(card)}>
                                {card}
                            </Card>}
                    </>
                ))}
            </CardList>
        </Container>
    );
};

export default VotingCards;
