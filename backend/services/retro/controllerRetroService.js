require('dotenv').config();
const config = require('../../config');
const { convertArrayToCamelCase, convertObjectKeysToCamelCase } = require('../../utils/utils');
const { v4: uuidv4 } = require('uuid');
const { putTable, getBoardDb, getBoardByUserDb } = require('./dynamoRetroService');
const logger = require('../generic/cloudWatchLoggerService');

const saveBoard = async (req, res) => {
  const start = performance.now()
  console.log("createBoard");

  let boardId = null
  let dateTime = null

  if (!req.body.boardId) {
    boardId = uuidv4()
  } else {
    boardId = req.body.boardId
  }

  if (!req.body.dateTime) {
    dateTime = new Date().toISOString()
  } else {
    dateTime = req.body.dateTime
  }

  let boardDb = {
    board_id: boardId,
    user_id: req.body.userId,
    date_time: dateTime,
    user_name: req.body.userName,
    board_name: req.body.boardName,
    squad_name: req.body.squadName,
    area_name: req.body.areaName,
    board_data: req.body.boardData,
    date_time_last_update: new Date().toISOString()
  };

  try {
    const data = await putTable(config.TABLE_BOARD, boardDb);
    res.status(201).json(convertObjectKeysToCamelCase(data));
    const elapsedTime = (performance.now() - start).toFixed(3);
   // logger.log('API-RETRO', 'createBoard', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName, '', elapsedTime, 'success', 'Board created successfully.')
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
  //  logger.log('API-RETRO', 'createBoard', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName, '', elapsedTime, 'failed', error.message)
    return res.status(500).json({ error: 'Error creating board' });
  }
};

const getBoard = async (req, res) => {
  const start = performance.now()

  console.log("getBoard");

  const { boardId } = req.params

  try {
    const dataItems = await getBoardDb(config.TABLE_BOARD, boardId);
    res.status(200).json(convertObjectKeysToCamelCase(dataItems));
    //res.status(200).json(dataItems);
    const elapsedTime = (performance.now() - start).toFixed(3);
    //  logger.log('API-RETRO', 'getBoardByUser', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName,  '', elapsedTime, 'success', 'Get board successfully.' )
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    if (error === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Board não encontrado' });
    } else {
      return res.status(500).json({ error: 'Error ao obter board' });
    }
  }
};


const getBoardByUser = async (req, res) => {
  const start = performance.now()

  console.log("getBoardByUser");

  const { userId } = req.params

  try {
    const dataItems = await getBoardByUserDb(config.TABLE_BOARD, config.INDEX_NAME_USER, userId);
    res.status(200).json(convertArrayToCamelCase(dataItems));
    const elapsedTime = (performance.now() - start).toFixed(3);
    //  logger.log('API-RETRO', 'getBoardByUser', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName,  '', elapsedTime, 'success', 'Get board successfully.' )
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    //   logger.log('API-RETRO', 'getBoardByUser', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName,  '', elapsedTime, 'failed', error.message )
    return res.status(500).json({ error: 'Error creating board' });
  }
};

module.exports = { saveBoard, getBoardByUser, getBoard };