const roomsDb = require('../../database');
const config = require('../../config');
const { putTable, getBoardDb } = require('./dynamoRetroService');


const connectClientRetro = (boardId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);
      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }
      resolve(boardData);
    } catch (error) {
      reject(error);
    }
  });
};

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
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém o board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      const sourceColumn = boardData.columns.find(col => col.id === source.droppableId);
      const destinationColumn = boardData.columns.find(col => col.id === destination.droppableId);

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
          ...boardData,
          columns: updatedColumns,
        };

        // Salva os dados no banco
        await putTable(config.TABLE_BOARD, updatedBoard);

        resolve(updatedBoard);
      }
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      reject(error);
    }
  });
};


const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};


const processCombine = (boardId, source, combine) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      let result;
      if (combine.droppableId === source.droppableId) {
        result = processCombineSameColumn(boardData, source, combine);
      } else {
        result = processCombineDifferentColumn(boardData, source, combine);
      }

      const updatedBoard = { ...boardData, columns: result };

      await putTable(config.TABLE_BOARD, updatedBoard);

      resolve(updatedBoard);
    } catch (error) {
      reject(error);
    }
  });
};

const processCombineDifferentColumn = (boardData, source, combine) => {
  const sourceCards = [...boardData.columns.find(col => col.id === source.droppableId).cards];
  const combineCards = [...boardData.columns.find(col => col.id === combine.droppableId).cards];

  // Obtém o card movido
  const sourceCard = sourceCards[source.index];

  // Remove o item da origem
  sourceCards.splice(source.index, 1);

  // Localiza e atualiza o card combinado
  const combineCardIndex = combineCards.findIndex(x => x.id === combine.draggableId);
  const combineCard = combineCards[combineCardIndex];
  combineCards[combineCardIndex] = {
    ...combineCard,
    content: `${combineCard.content}\n+\n${sourceCard.content}`
  };

  // Atualiza as colunas
  const updatedColumns = boardData.columns.map(column => {
    if (column.id === combine.droppableId) {
      return { ...column, cards: combineCards };
    }
    if (column.id === source.droppableId) {
      return { ...column, cards: sourceCards };
    }
    return column;
  });

  return updatedColumns;
};

const processCombineSameColumn = (boardData, source, combine) => {
  const combineCards = [...boardData.columns.find(col => col.id === combine.droppableId).cards];

  // Obtém o card movido
  const sourceCard = combineCards[source.index];

  // Remove o item da origem
  combineCards.splice(source.index, 1);

  // Localiza e atualiza o card combinado
  const combineCardIndex = combineCards.findIndex(x => x.id === combine.draggableId);
  const combineCard = combineCards[combineCardIndex];
  combineCards[combineCardIndex] = {
    ...combineCard,
    content: `${combineCard.content}\n+\n${sourceCard.content}`
  };

  // Atualiza as colunas
  const updatedColumns = boardData.columns.map(column =>
    column.id === combine.droppableId ? { ...column, cards: combineCards } : column
  );

  return updatedColumns;
};

const deleteColumn = (boardId, index) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Remove a coluna pelo índice
      const updatedBoardData = { ...boardData };
      if (index < 0 || index >= updatedBoardData.columns.length) {
        return reject(new Error('Índice inválido para deletar a coluna.'));
      }

      updatedBoardData.columns.splice(index, 1);

      // Atualiza o board no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      // Rejeita a promise em caso de erro
      reject(error);
    }
  });
};

const addColumn = (boardId, newCollumn) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Adiciona a coluna pelo índice
      const updatedBoardData = { ...boardData };
      updatedBoardData.columns.push(newCollumn);

      // Atualiza o board no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      reject(error);
    }
  });
};


const updateTitleColumn = (boardId, content, index) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Verifica se o índice é válido
      if (index < 0 || index >= boardData.columns.length) {
        return reject(new Error('Índice inválido para atualizar o título da coluna.'));
      }

      // Atualiza o título da coluna
      const updatedBoardData = { ...boardData };
      updatedBoardData.columns[index].title = content;

      // Salva o board atualizado no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      // Rejeita a promise em caso de erro
      reject(error);
    }
  });
};

const setIsObfuscated = (boardId, isObfuscated ) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Atualiza isObfuscated
      const updatedBoardData = { ...boardData };
      updatedBoardData.isObfuscated = isObfuscated

      // Salva o board atualizado no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      // Rejeita a promise em caso de erro
      reject(error);
    }
  });
};

const updatecolorCards = (boardId, colorCards, index) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Verifica se o índice é válido
      if (index < 0 || index >= boardData.columns.length) {
        return reject(new Error('Índice inválido para atualizar o título da coluna.'));
      }

      // Atualiza o título da coluna
      const updatedBoardData = { ...boardData };
      updatedBoardData.columns[index].colorCards = colorCards;

      // Salva o board atualizado no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      // Rejeita a promise em caso de erro
      reject(error);
    }
  });
};

const updateLike = (boardId, isIncrement, indexCard, indexColumn) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Verifica se os índices fornecidos são válidos
      if (indexColumn < 0 || indexColumn >= boardData.columns.length) {
        return reject(new Error('Índice de coluna inválido.'));
      }

      if (indexCard < 0 || indexCard >= boardData.columns[indexColumn].cards.length) {
        return reject(new Error('Índice de card inválido.'));
      }

      // Atualiza a contagem de likes do card
      const updatedBoardData = { ...boardData };
      const columnToUpdate = updatedBoardData.columns[indexColumn];
      const countLike = columnToUpdate.cards[indexCard].likeCount;
      const countLikeUpdate = isIncrement ? countLike + 1 : countLike - 1;

      columnToUpdate.cards[indexCard].likeCount = countLikeUpdate;

      // Salva os dados atualizados no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      // Rejeita a promise em caso de erro
      reject(error);
    }
  });
};


const deleteCard = (boardId, indexCard, indexColumn) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Verifica se os índices fornecidos são válidos
      if (indexColumn < 0 || indexColumn >= boardData.columns.length) {
        return reject(new Error('Índice de coluna inválido.'));
      }

      if (indexCard < 0 || indexCard >= boardData.columns[indexColumn].cards.length) {
        return reject(new Error('Índice de card inválido.'));
      }

      // Atualiza a estrutura de dados para remover o card
      const updatedBoardData = { ...boardData };
      const columnToUpdate = updatedBoardData.columns[indexColumn];
      columnToUpdate.cards.splice(indexCard, 1);

      // Salva os dados atualizados no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      // Rejeita a promise em caso de erro
      reject(error);
    }
  });
};

const deleteAllCard = (boardId, indexColumn) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Verifica se os índices fornecidos são válidos
      if (indexColumn < 0 || indexColumn >= boardData.columns.length) {
        return reject(new Error('Índice de coluna inválido.'));
      }

      // Atualiza a estrutura de dados para remover o card
      const updatedBoardData = { ...boardData };
      const columnToUpdate = updatedBoardData.columns[indexColumn];
      columnToUpdate.cards = [];

      // Salva os dados atualizados no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      // Rejeita a promise em caso de erro
      reject(error);
    }
  });
};

const saveCard = (boardId, content, indexCard, indexColumn) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os dados do board no banco de dados
      const boardData = await getBoardDb(config.TABLE_BOARD, boardId);

      if (!boardData) {
        return reject(new Error('Board não encontrado.'));
      }

      // Verifica se os índices fornecidos são válidos
      if (indexColumn < 0 || indexColumn >= boardData.columns.length) {
        return reject(new Error('Índice de coluna inválido.'));
      }

      if (indexCard < 0 || indexCard >= boardData.columns[indexColumn].cards.length) {
        return reject(new Error('Índice de card inválido.'));
      }

      // Atualiza o conteúdo do card
      const updatedBoardData = { ...boardData };
      const columnToUpdate = updatedBoardData.columns[indexColumn];
      columnToUpdate.cards[indexCard].content = content;

      // Salva os dados atualizados no banco de dados
      await putTable(config.TABLE_BOARD, updatedBoardData);

      // Retorna o board atualizado
      resolve(updatedBoardData);
    } catch (error) {
      // Rejeita a promise em caso de erro
      reject(error);
    }
  });
};



module.exports = {connectClientRetro, addCardBoard, reorderBoard, processCombine, deleteColumn, addColumn, updateTitleColumn, updateLike, deleteCard, deleteAllCard, saveCard, updatecolorCards, setIsObfuscated };