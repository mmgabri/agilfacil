import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "@atlaskit/theme";

const getBackgroundColor = (isDragging, isGroupedOver, authorColors) => {
  if (isDragging) return authorColors.soft;
  if (isGroupedOver) return colors.N30;
  return colors.N0;
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
    borderRadius: 2,
    border: "2px solid transparent",
    borderColor: (props) => getBorderColor(props.isDragging, props.colors),
    backgroundColor: (props) =>
      getBackgroundColor(props.isDragging, props.isGroupedOver, props.colors),
    boxShadow: ({ isDragging }) =>
      isDragging ? `2px 2px 1px ${colors.N70}` : "none",
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
  },

  content: {
    flexGrow: 1,
    flexBasis: "100%",
    display: "flex",
    flexDirection: "column"
  },

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