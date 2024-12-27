import React, { memo } from "react";
import styled from "@emotion/styled";
import { Droppable, Draggable } from "react-beautiful-dnd";
import CardsItem from "./CardsItem";
import ColumnHeader from "./ColumnHeader";

const grid = 8;
const scrollContainerHeight = 250;

// Componente para montar as Colunas
const ColumnContent = ({ cards, title, dropProvided, indexColumn, onSaveCard, onDeleteCard, onUpdateLike, onUpdateTitleColumn, onDeleteColumn, onAddCard }) => (
  <InnerContainer>
    <ColumnHeader columnTitle={title} index={indexColumn} onUpdateTitleColumn={onUpdateTitleColumn} onDeleteColumn={onDeleteColumn} onAddCard={onAddCard}></ColumnHeader>
    <DropZone ref={dropProvided.innerRef}>
      <DraggableCardList cards={cards} indexColumn={indexColumn} onSaveCard={onSaveCard} onDeleteCard={onDeleteCard} onUpdateLike={onUpdateLike} />
      {dropProvided.placeholder}
    </DropZone>
  </InnerContainer>
);

// Componente para montar os Cards
const DraggableCardList = memo(({ cards, indexColumn, onSaveCard, onDeleteCard, onUpdateLike }) =>
  cards.map((card, index) => {
    return (
      <Draggable key={card.id} draggableId={card.id} index={index} indexColumn={indexColumn}>
        {(dragProvided, dragSnapshot) => (
          <CardsItem
            card={card}
            isDragging={dragSnapshot.isDragging}
            isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
            provided={dragProvided}
            onSaveCard={onSaveCard}
            onDeleteCard={onDeleteCard}
            onUpdateLike={onUpdateLike}
            index={index}
            indexColumn={indexColumn}
          />
        )}
      </Draggable>
    );
  })
);


// Componente principal
export default function Column(props) {
  const {isCombineEnabled, listId = "LIST", listType, cards, title, onSaveCard, onDeleteCard, onUpdateLike, onUpdateTitleColumn, onDeleteColumn, onAddCard, indexColumn } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      isCombineEnabled={isCombineEnabled}
    >
      {(dropProvided, dropSnapshot) => (
        <ColumnsContainer>
          <ColumnWrapper
            isDraggingOver={dropSnapshot.isDraggingOver}
            isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
            {...dropProvided.droppableProps}
          >
            <ColumnContent
              cards={cards}
              title={title}
              dropProvided={dropProvided}
              indexColumn={indexColumn}
              onSaveCard={onSaveCard}
              onDeleteCard={onDeleteCard}
              onUpdateLike={onUpdateLike}
              onUpdateTitleColumn={onUpdateTitleColumn}
              onDeleteColumn={onDeleteColumn}
              onAddCard={onAddCard}
            />
          </ColumnWrapper>
        </ColumnsContainer>
      )}
    </Droppable>
  );
}


// Estilizações

// Função utilitária para definir o background dinamicamente
const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
  if (isDraggingOver) return "#404040";
  if (isDraggingFrom) return "#585858";
  return "#282c34";
};

const ColumnWrapper = styled.div`
  background-color: ${(props) =>
    getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)};
  display: flex;
  flex-direction: column;
  opacity: ${({ isDropDisabled }) => (isDropDisabled ? 0.5 : "inherit")};
  padding: ${grid}px;
  border: ${grid}px;
  padding-bottom: 0;
  transition: background-color 0.2s ease, opacity 0.1s ease;
  user-select: none;
  flex: 1; /* Faz a coluna ocupar o mesmo espaço disponível, mas sem exceder o espaço total */
  min-width: 200px; /* Tamanho mínimo da coluna para telas menores */
  box-sizing: border-box;

  @media (max-width: 768px) {
    min-width: 150px; /* Reduz o tamanho mínimo em telas menores */
    max-width: 200px;
  }

  @media (max-width: 480px) {
    min-width: 120px;
    max-width: 180px;
  }
`;

const ColumnsContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* Permite quebrar as colunas para a próxima linha em telas menores */
  justify-content: center; /* Centraliza as colunas */
  width: 100%; /* A largura total deve ocupar 100% do espaço */
  gap: 10px; /* Adiciona um pequeno espaço entre as colunas */
`;

const DropZone = styled.div`
  min-height: ${scrollContainerHeight}px;
  padding-bottom: ${grid}px;
`;

const ScrollContainer = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  max-height: ${scrollContainerHeight}px;
`;

const InnerContainer = styled.div``;