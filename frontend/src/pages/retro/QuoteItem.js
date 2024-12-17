import React from "react";
import { createUseStyles } from "react-jss";
import { colors } from "@atlaskit/theme";

// export const grid = 8;
// export const borderRadius = 2;

const getBackgroundColor = (isDragging, isGroupedOver, authorColors) => {
  if (isDragging) {
    return authorColors.soft;
  }

  if (isGroupedOver) {
    return colors.N30;
  }

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
  textDecoration: "none", // Adicionando aqui para garantir que o texto não será sublinhado

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
  avatar: {
    width: imageSize,
    height: imageSize,
    borderRadius: "50%",
    marginRight: 8,
    flexShrink: 0,
    flexGrow: 0
  },
  content: {
    flexGrow: 1,
    flexBasis: "100%",
    display: "flex",
    flexDirection: "column"
  },
  blockQuote: {
    "&::before": {
      content: "open-quote"
    },
    "&::after": {
      content: "close-quote"
    }
  },
  footer: {
    display: "flex",
    marginTop: 8,
    alignItems: "center"
  },
  author: {
    // color: (props) => props.colors.hard,
    flexGrow: 0,
    margin: 0,
    // backgroundColor: (props) => props.colors.soft,
    borderRadius: 2,
    fontWeight: "normal",
    padding: 4
  },
  quoteId: {
    flexGrow: 1,
    flexShrink: 1,
    margin: 0,
    fontWeight: "normal",
    textOverflow: "ellipsis",
    textAlign: "right"
  }
});

function getStyle(provided, style) {
  if (!style) {
    return provided.draggableProps.style;
  }

  return {
    ...provided.draggableProps.style,
    ...style
  };
}

function QuoteItem(props) {
  const {
    quote,
    isDragging,
    // isGroupedOver,
    provided,
    style,
    isClone,
    index
  } = props;

  //console.log('quote ==>', quote)

  //const colors = quote.author.colors;

  const cl = useStyles({ ...props, colors });

  return (
    <a
      className={cl.container}
      //href={quote.author.url}
      // isDragging={isDragging}
      // isGroupedOver={isGroupedOver}
      // isClone={isClone}
      // colors={quote.author.colors}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={getStyle(provided, style)}
      data-is-dragging={isDragging}
      data-testid={quote.id}
      data-index={index}
    >
      {isClone ? <div className={cl.cloneBadge}>Clone</div> : null}
      <div className={cl.content}>
        <div>{quote.content}</div>
      </div>
    </a>
  );
}

export default React.memo(QuoteItem);
