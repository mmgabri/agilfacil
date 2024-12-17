// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default reorder;

export const reorderQuoteMap = (quoteMap, source, destination) => {
  console.log('--- reorderQuoteMap ---')
  //-const current = [...quoteMap[source.droppableId]];
  const current = [...quoteMap.columns.find(col => col.id === source.droppableId).cards];
  //-const next = [...quoteMap[destination.droppableId]];
  const next = [...quoteMap.columns.find(col => col.id === destination.droppableId).cards];
  const target = current[source.index];

  // moving to same list
  if (source.droppableId === destination.droppableId) {
    const reordered = reorder(current, source.index, destination.index);

    const result = quoteMap.columns.map(column =>
      column.id === source.droppableId ? { ...column, cards: reordered } : column
    );

    return result;
  }

  // moving to different list

  // remove from original
  current.splice(source.index, 1);
  // insert into next
  next.splice(destination.index, 0, target);

  const result = quoteMap.columns.map(column => {
    if (column.id === source.droppableId) {
      return { ...column, cards: current };
    }
    if (column.id === destination.droppableId) {
      return { ...column, cards: next };
    }
    return column; // Retorna as colunas não alteradas
  });

  return result;
};

export const processCombine = (quoteMap, source, combine) => {
  if (combine.droppableId === source.droppableId) {
    const result = processCombineSameColumn(quoteMap, source, combine)
    return result
  } else {
    const result = processCombineDifferentColumn(quoteMap, source, combine)
    return result
  }
}

const processCombineDifferentColumn = (quoteMap, source, combine) => {
  const sourceQuotes = [...quoteMap.columns.find(col => col.id === source.droppableId).cards];
  const combineQuotes = [...quoteMap.columns.find(col => col.id === combine.droppableId).cards];

  //Obtem card movido
  const sourceQuote = sourceQuotes[source.index];
  console.log('combineQuotes ==>', combineQuotes)
  console.log('sourceQuotes ==>', sourceQuotes)
  console.log('source.droppableId -->', source.droppableId)

  // Remove o item da origem e destino
  sourceQuotes.splice(source.index, 1);
  console.log('sourceQuotes - após remove - ==>', sourceQuotes)

  const combineQuoteIndex = combineQuotes.findIndex(
    (x) => x.id === combine.draggableId
  );
  const combineQuote = combineQuotes[combineQuoteIndex];
  combineQuotes[combineQuoteIndex] = {
    ...combineQuote,
    content: `${combineQuote.content} ${sourceQuote.content}`
  };

  const updatedColumns = quoteMap.columns.map(column => {
    if (column.id === combine.droppableId) {
      // Atualiza os cards da coluna que combinou
      return { ...column, cards: combineQuotes };
    }
    if (column.id === source.droppableId) {
      // Atualiza os cards da coluna de origem
      return { ...column, cards: sourceQuotes };
    }
    return column; // Retorna as colunas não alteradas
  });

  return updatedColumns;

}

const processCombineSameColumn = (quoteMap, source, combine) => {
  const sourceQuotes = [...quoteMap.columns.find(col => col.id === source.droppableId).cards];
  const combineQuotes = [...quoteMap.columns.find(col => col.id === combine.droppableId).cards];

  //Obtem card movido
  const sourceQuote = combineQuotes[source.index];

  // Remove o item da origem e destino
  combineQuotes.splice(source.index, 1);
  //sourceQuotes.splice(source.index, 1);

  // Obtem o card com o qual foi combinado
  const combineQuoteIndex = combineQuotes.findIndex(
    (x) => x.id === combine.draggableId
  );
  const combineQuote = combineQuotes[combineQuoteIndex];

  // Atualiza o conteúdo do item combinado, concatenando os textos
  combineQuotes[combineQuoteIndex] = {
    ...combineQuote,
    content: `${combineQuote.content} ${sourceQuote.content}`
  };

  //Atualiza estado
  const updatedQuoteMap = quoteMap.columns.map(column =>
    column.id === combine.droppableId ? { ...column, cards: combineQuotes } : column
  );

  return updatedQuoteMap;
}

