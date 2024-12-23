const roomsDb = require('../../database');
const config = require('../../config');
const { putTable, getBoardDb } = require('./dynamoRetroService');

const addCardBoard = (boardId, newCard, indexColumn) => {
  return new Promise(async (resolve, reject) => {
    try {
      //obtem board
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      //inclui card
      const updatedBoard = { ...boardData };
      const column = updatedBoard.columns[indexColumn];
      column.cards.push(newCard);

      //salva dados
      await putTable(config.TABLE_BOARD, updatedBoard);

      //retorna
      resolve(updatedBoard)
    } catch (error) {
      reject(error)
    }
  });
}

const reorderBoard = (boardId, source, destination) => {
  console.log('--- reorderBoard ---', source, destination);
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém o board completo
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      // Identifica as colunas de origem e destino
      const sourceColumn = boardData.columns.find(col => col.id === source.droppableId);
      const destinationColumn = boardData.columns.find(col => col.id === destination.droppableId);

      if (!sourceColumn || !destinationColumn) {
        throw new Error('Coluna de origem ou destino não encontrada.');
      }

      const currentCards = [...sourceColumn.cards];
      const targetCard = currentCards[source.index];

      if (source.droppableId === destination.droppableId) {
        // Reordenação dentro da mesma coluna
        const reorderedCards = reorder(currentCards, source.index, destination.index);

        const updatedColumns = boardData.columns.map(column =>
          column.id === source.droppableId ? { ...column, cards: reorderedCards } : column
        );

        const updatedBoard = {
          ...boardData, // Inclui todos os campos existentes no board
          columns: updatedColumns, // Atualiza apenas as colunas
        };

        // Salva os dados no banco
        await putTable(config.TABLE_BOARD, updatedBoard);

        console.log('Reordenado na mesma coluna');
        resolve(updatedBoard);
      } else {
        // Movendo entre colunas diferentes
        const sourceCards = [...sourceColumn.cards];
        const destinationCards = [...destinationColumn.cards];

        // Remove o card da coluna de origem
        sourceCards.splice(source.index, 1);
        // Adiciona o card à coluna de destino
        destinationCards.splice(destination.index, 0, targetCard);

        const updatedColumns = boardData.columns.map(column => {
          if (column.id === source.droppableId) {
            return { ...column, cards: sourceCards };
          } else if (column.id === destination.droppableId) {
            return { ...column, cards: destinationCards };
          } else {
            return column;
          }
        });

        const updatedBoard = {
          ...boardData, // Inclui todos os campos existentes no board
          columns: updatedColumns, // Atualiza apenas as colunas
        };

        // Salva os dados no banco
        await putTable(config.TABLE_BOARD, updatedBoard);

        console.log('Movido para outra coluna');
        resolve(updatedBoard);
      }
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      reject(error);
    }
  });
};



// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

module.exports = { addCardBoard, reorderBoard };