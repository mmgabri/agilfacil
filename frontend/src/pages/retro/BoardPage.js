import React, { useState, useCallback } from "react";
import { createUseStyles } from "react-jss";
import { colors } from "@atlaskit/theme";
import { DragDropContext } from "react-beautiful-dnd";
import Columns from "./Columns";
import { reorderboardData, processCombine } from "./FunctionsRetro";

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

const BoardPage = ({ initial, isCombineEnabled }) => {
  const [boardData, setBoardData] = useState(initial);
  const cl = useStyles();

  // Função de manuseio do fim do arraste
  const onDragEnd = (result) => {
    console.log('--- onDragEnd ---')
    console.log('result', result);

    const { source, destination, combine } = result;

    if (destination) {
      const updatedColumns = reorderboardData(boardData, source, destination);
      setBoardData({ ...boardData, columns: updatedColumns });
    } else if (combine) {
      const updatedColumns = processCombine(boardData, source, combine);
      setBoardData({ ...boardData, columns: updatedColumns });
    }

  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={cl.root}>
        {boardData.columns.map((column) => (
          <div key={column.id} className={cl.column}>
            <Columns
              title={column.title}
              listId={column.id}
              listType="card"
              cards={column.cards}
              isCombineEnabled={isCombineEnabled}
            />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

export default BoardPage;