import React, { useState } from 'react';
import Column from './Column';
import styled from 'styled-components';

const BoardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
`;

const Board = () => {
  const [draggedCard, setDraggedCard] = useState(null);
  const [overlappingCardId, setOverlappingCardId] = useState(null);

  const [columns, setColumns] = useState([
    {
      id: 'column-1',
      title: 'Todo',
      cards: [
        { id: 'card-1', text: 'Card 1', columnId: 'column-1' },
        { id: 'card-2', text: 'Card 2', columnId: 'column-1' },
        { id: 'card-a', text: 'Card a', columnId: 'column-1' },
        { id: 'card-b', text: 'Card b', columnId: 'column-1' },
      ],
    },
    {
      id: 'column-2',
      title: 'Doing',
      cards: [
        { id: 'card-3', text: 'Card 3', columnId: 'column-2' },
        { id: 'card-4', text: 'Card 4', columnId: 'column-2' },
      ],
    },
  ]);

  

  const handleDragStart = (card) => {
    setDraggedCard(card);
  };

  
  // Ao soltar o card
  const handleDrop = (event, targetCard, targetColumn) => {
    console.log('-------------- handleDrop ----------------')
    console.log('targetColumn==>', targetColumn);
    console.log('draggedCard ==>', draggedCard);
    console.log('targetCard ==>', targetCard);


    // Se o targetCard for null, significa que o drop foi feito na coluna
    if (targetCard === null) {
      console.log('Card foi solto na coluna:', targetColumn.title);
      if (targetColumn.id === draggedCard.columnId) {
        console.log('Card movimentado dentro da mesma coluna. Nada a fazer por enquanto')
      } else {
        moveCardToOtherColumn(draggedCard, targetColumn.id)
      }
      return
    }

    console.log('Card foi solto no card:', targetCard.id);

    if (draggedCard.columnId != targetCard.columnId ){
      console.log('Não junta card entre colunas diferentes')
      return
    }

    // Pergunta ao usuário se ele deseja juntar os cards
    const confirmMerge = window.confirm("Você deseja realmente juntar esses cards?");

    // Se o usuário não confirmar, interrompe a execução
    if (!confirmMerge) return;

    const newColumns = columns.map((column) => {
      const updatedCards = column.cards.map((card) => {
        console.log('card.id ==>', card.id)
        console.log('draggedCard.id ==>', draggedCard.id)
        if (card.id === targetCard.id) {
          console.log('Juntou texto')
          //return { ...card, text: `${card.text} ------- ${draggedCard.text}` };
          return { 
            ...card, 
            text: `${card.text}<br />--------<br />${draggedCard.text}` 
          };
        }
        return card;
      }).filter((card) => card.id !== draggedCard.id);

      return { ...column, cards: updatedCards };
    });

    setColumns(newColumns);
    setDraggedCard(null);
    setOverlappingCardId(null);  // Resetando o estado do card sobre o qual o card foi solto

  };


  const moveCardToOtherColumn = (draggedCard, targetColumnId) => {
    console.log('------------------------------handleColumnDrop -------------------------------')
    //    console.log('Drop event==>', event);  // Aqui podemos ver se o evento de "drop" chega corretamente
    console.log('draggedCard ==>', draggedCard)
    console.log('targetColumnId ==>', targetColumnId)
    console.log('targetColumnId ==>', targetColumnId)
    console.log('----------------------------------')

    if (draggedCard.columnId === targetColumnId) return;

    let columnIdOrigCard = draggedCard.columnId
    draggedCard.columnId = targetColumnId;

    const updatedColumns = columns.map((column) => {
      console.log('draggedCard.columnId==>', draggedCard.columnId)
      console.log(' targetColumnId==>', targetColumnId)
      //Verifica se a coluna atual (column) é a coluna de origem, de onde o card foi arrastado.
      if (column.id === columnIdOrigCard) {
        console.log('remove card da coluna destino')
        //Se for a coluna de origem, ele cria uma nova versão dela, removendo o card arrastado da lista de cards dessa coluna.
        return {
          ...column,
          cards: column.cards.filter((card) => card.id !== draggedCard.id),
        };
      }
      // Verifica se a coluna atual é a coluna de destino, para onde o card foi arrastado.
      if (column.id === targetColumnId) {
        console.log('adiciona card na coluna destino')
        return {
          ...column,
          cards: [...column.cards, { ...draggedCard }],
        };
      }
      console.log('Fim')
      return column;
    });

    setColumns(updatedColumns);
    setDraggedCard(null);
  };


  return (
    <BoardContainer>
      {columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          handleDragStart={handleDragStart}
          handleDrop={handleDrop}
          overlappingCardId={overlappingCardId}
          setOverlappingCardId={setOverlappingCardId}
        />
      ))}
    </BoardContainer>
  );
};

export default Board;