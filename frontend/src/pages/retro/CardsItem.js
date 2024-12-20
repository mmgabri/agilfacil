import React from "react";
import styled from "styled-components";
import { colors } from "@atlaskit/theme";

const getBackgroundColor = (isDragging, isGroupedOver) => {
  if (isDragging) return "#D8968C"; 
  if (isGroupedOver) return "#77DD77";
  return "#F0E68C"; // Amarelo Claro
  //Amarelo Claro: #FFFF00
  //Amarelo Esverdeado: #9ACD32
  //Amarelo Biscoito: #F0E68C - bom
  //Amarelo Limão: #FFF700
  //Amarelo Creme: #FFF5B7
  //Amarelo Manteiga: #F6E3B4
  //Amarelo Charme: #F9D423
  //Amarelo Daffodil: #FFFF31
  //Amarelo Banana: #FFE135
  //Amarelo Marfim: #F4F1C1
  //Amarelo Envelhecido: #DDBB66 - bom

  //Verde Pastel: #77DD77
  //Verde Floresta Claro: #6DBE45

  //Rosa Pastel: #F7A7C1
  //Rosa Quartzo: #F1C6D1
  //Rosa Flamingo: #F6A5B2
  //Rosa Envelhecido: #D8968C

};

const getBorderColor = (isDragging) =>
  //  isDragging ? "#0000FF" : "transparent"; // Azul para arrasto, transparente caso contrário
  isDragging ? "black" : "transparent"; // Azul para arrasto, transparente caso contrário

const imageSize = 40;

const CloneBadge = styled.div`
  background: ${colors.G100};
  bottom: 4px;
  border: 2px solid ${colors.G200};
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 10px;
  position: absolute;
  right: -${imageSize / 3}px;
  top: -${imageSize / 3}px;
  transform: rotate(40deg);
  height: ${imageSize}px;
  width: ${imageSize}px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.a`
  border-radius: 6px;
  border: 2px solid ${(props) => getBorderColor(props.isDragging)};
  background-color: ${(props) =>
    getBackgroundColor(props.isDragging, props.isGroupedOver)};
  box-shadow: ${(props) =>
    props.isDragging
      ? `2px 2px 2px ${colors.N70}, -2px -2px 2px ${colors.N70}, 1px 1px 4px ${colors.N70}`
      : "none"};
  box-sizing: border-box;
  padding: 8px;
  min-height: ${imageSize}px;
  margin-bottom: 8px;
  user-select: none;
  color: ${colors.N900};
  text-decoration: none;
  display: flex;

  &:hover,
  &:active {
    color: ${colors.N900};
    text-decoration: none;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
`;

const Content = styled.div`
  display: flex;
`;

function getStyle(provided, style) {
  return style ? { ...provided.draggableProps.style, ...style } : provided.draggableProps.style;
}

function CardItem(props) {
  const { card, isDragging, provided, style, isClone, index } = props;

  return (
    <Container
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      isDragging={isDragging} // Passa o estado de isDragging
      isGroupedOver={props.isGroupedOver} // Passa o estado de isGroupedOver
      data-is-dragging={isDragging}
      data-testid={card.id}
      data-index={index}
    >
      {isClone && <CloneBadge>Clone</CloneBadge>}
      <Content>
        <div>{card.content}</div>
      </Content>
    </Container>
  );
}

export default React.memo(CardItem);
