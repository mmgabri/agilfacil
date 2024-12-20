import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "@atlaskit/theme";

const getBackgroundColor = (isDragging, isGroupedOver, authorColors) => {
  if (isDragging) return authorColors.soft;
  if (isGroupedOver) return colors.N30;
  return "#F0E68C";
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


const getBorderColor = (isDragging, authorColors) =>
  isDragging ? authorColors.hard : "transparent";

const imageSize = 40;

const useStyles = createUseStyles({
  cloneBadge: {
    background: colors.G100,
    bottom: 4,
    border: `2px solid ${colors.G200}`,
    borderRadius: "50%",
    boxSizing: "border-box",
    fontSize: 10,
    position: "absolute",
    right: -imageSize / 3,
    top: -imageSize / 3,
    transform: "rotate(40deg)",
    height: imageSize,
    width: imageSize,
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  
  container: {
    borderRadius: 6,
    border: "2px solid transparent",
    backgroundColor: (props) =>
      getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors),
    boxShadow: ({ isDragging }) =>
      isDragging
        ? `2px 2px 2px ${colors.N70}, -2px -2px 2px ${colors.N70}, 1px 1px 4px ${colors.N70}`
        : "none", // Criando bordas "irregulares" com sombras diferentes
    boxSizing: "border-box",
    padding: 8,
    minHeight: imageSize,
    marginBottom: 8,
    userSelect: "none",
    color: colors.N900,
    textDecoration: "none",
    "&:hover,&:active": {
      color: colors.N900,
      textDecoration: "none"
    },
    "&:focus": {
      outline: "none",
      boxShadow: "none"
    },
    display: "flex"
  }
  
  
  
  
  
  

});

// Função para mesclar o estilo fornecido com o estilo de arraste
function getStyle(provided, style) {
  return style ? { ...provided.draggableProps.style, ...style } : provided.draggableProps.style;
}


function CardItem(props) {
  const { card, isDragging, provided, style, isClone, index } = props;

  const cl = useStyles({ ...props, colors });

  return (
    <a
      className={cl.container}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={card.id}
      data-index={index}
    >
       {isClone && <div className={cl.cloneBadge}>Clone</div>}
      <div className={cl.content}>
        <div>{card.content}</div>
      </div>
    </a>
  );
}

export default React.memo(CardItem);