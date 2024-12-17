import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "@atlaskit/theme";
import { DragDropContext } from "react-beautiful-dnd";
import QuoteList from "./QuoteList";
import { reorderQuoteMap, processCombine } from "./FunctionsRetro";

const useStyles = createUseStyles({
  root: {
    backgroundColor: colors.B200,
    boxSizing: "border-box",
    padding: 16,
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start"
  },
  column: {
    margin: "0 8px"
  }
});

const QuoteApp = (props) => {
  const { initial, isCombineEnabled } = props;
  const [quoteMap, setQuoteMap] = useState(initial);

  const cl = useStyles();


  const onDragEnd = (result) => {
    console.log('--- onDragEnd ---')
    console.log('result', result);

    const { source, destination, combine } = result;

    if (destination) {
      const updatedQuoteMap = reorderQuoteMap(quoteMap, source, destination);
      setQuoteMap({ ...quoteMap, columns: updatedQuoteMap });
    } else if (combine) {
      const updatedQuoteMap = processCombine(quoteMap, source, combine)
      setQuoteMap({ ...quoteMap, columns: updatedQuoteMap });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={cl.root}>
        {/* Mapeando as colunas dinamicamente */}
        {quoteMap.columns.map((column) => (
          <div key={column.id} className={cl.column}>
            <QuoteList
              title={column.title} // Título da coluna
              listId={column.id} // Identificador único da coluna
              listType="card" // Tipo da lista (aqui continua sendo "card", mas pode ser ajustado)
              quotes={column.cards} // Cards da coluna
              isCombineEnabled={isCombineEnabled} // Habilita ou desabilita combinações, conforme necessário
            />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default QuoteApp;