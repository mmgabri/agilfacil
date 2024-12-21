const roomsDb = require('../../database');
const config = require('../../config');
const { putTable, getBoardDb } = require('./dynamoRetroService');
const { convertArrayToCamelCase, convertObjectKeysToCamelCase } = require('../../utils/utils');

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
      const result = convertObjectKeysToCamelCase(updatedBoard)  
      resolve(result)
    } catch (error) {
      reject(error)
    }
  });
};

module.exports = { addCardBoard };