import React from "react";
import styled from "@emotion/styled";
import { colors } from "@atlaskit/theme";
import { Droppable, Draggable } from "react-beautiful-dnd";
import CardsItem from "./CardsItem";
import ColumnHeader from "./ColumnHeader";

const grid = 8;
const scrollContainerHeight = 250;

// Função utilitária para definir o background dinamicamente
const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
  if (isDraggingOver) return colors.R50;
  if (isDraggingFrom) return colors.T50;
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
  max-width: 300px; /* Limita a largura para 300px */
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

// Subcomponente para renderizar a lista de cards
const DraggableCardList = React.memo(({ cards }) =>
  cards.map((card, index) => (
    <Draggable key={card.id} draggableId={card.id} index={index}>
      {(dragProvided, dragSnapshot) => (
        <CardsItem
          card={card}
          isDragging={dragSnapshot.isDragging}
          isGroupedOver={Boolean(dragSnapshot.combineTargetFor)}
          provided={dragProvided}
        />
      )}
    </Draggable>
  ))
);

// Subcomponente para renderizar o título e os cards dentro da área droppable
const ColumnContent = ({ cards, dropProvided, title }) => (
  <InnerContainer>
    <ColumnHeader columnTitle={title}></ColumnHeader>
    <DropZone ref={dropProvided.innerRef}>
      <DraggableCardList cards={cards} />
      {dropProvided.placeholder}
    </DropZone>
  </InnerContainer>
);

// Componente principal
export default function Column(props) {
  const {
    ignoreContainerClipping,
    internalScroll,
    scrollContainerStyle,
    isDropDisabled,
    isCombineEnabled,
    listId = "LIST",
    listType,
    style,
    cards,
    title,
    useClone,
  } = props;

  return (
    <Droppable
      droppableId={listId}
      type={listType}
      ignoreContainerClipping={ignoreContainerClipping}
      isDropDisabled={isDropDisabled}
      isCombineEnabled={isCombineEnabled}
      renderClone={
        useClone
          ? (provided, snapshot, descriptor) => (
              <CardsItem
                card={cards[descriptor.source.index]}
                provided={provided}
                isClone
              />
            )
          : null
      }
    >
      {(dropProvided, dropSnapshot) => (
        <ColumnsContainer>
          <ColumnWrapper
            style={style}
            isDraggingOver={dropSnapshot.isDraggingOver}
            isDropDisabled={isDropDisabled}
            isDraggingFrom={Boolean(dropSnapshot.draggingFromThisWith)}
            {...dropProvided.droppableProps}
          >
            {internalScroll ? (
              <ScrollContainer style={scrollContainerStyle}>
                <ColumnContent
                  cards={cards}
                  title={title}
                  dropProvided={dropProvided}
                />
              </ScrollContainer>
            ) : (
              <ColumnContent
                cards={cards}
                title={title}
                dropProvided={dropProvided}
              />
            )}
          </ColumnWrapper>
        </ColumnsContainer>
      )}
    </Droppable>
  );
}