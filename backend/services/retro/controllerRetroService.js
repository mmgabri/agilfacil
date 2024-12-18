require('dotenv').config();
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');
const {putTable} = require('./dynamoRetroService');
const logger = require('../generic/cloudWatchLoggerService');

const createBoard = async (req, res) => {
  const start = performance.now()
  console.log("createBoard");

  let obj = {
    boardId: uuidv4(),
    date_time: new Date().toISOString(),
    user_id: req.body.user_id,
    userName: req.body.userName,
    boardName: req.body.boardName,
    squadName: req.body.squadName,
    areaName: req.body.areaName,
    boardData: req.body.boardData
  };

  let userBoard = {
    user_id: req.body.user_id,
    date_time: obj.date_time,
    boardId: obj.boardId,
    userName: req.body.userName,
    boardName: req.body.boardName,
    squadName: req.body.squadName,
    areaName: req.body.areaName,
  };

  let board = {
    board_id: obj.boardId,
    date_time: new Date().toISOString(),
    dateTimeLastUpdate: new Date().toISOString(),
    boardData: req.body.boardData
  };

  try {
    await putTable(config.TABLE_USER_BOARD, userBoard);
    await putTable(config.TABLE_BOARD, board);
    res.status(201).json(obj);
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API-RETRO', 'createBoard', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName,  '', elapsedTime, 'success', 'Board created successfully.' )
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API-RETRO', 'createBoard', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName,  '', elapsedTime, 'failed', error.message )
    return res.status(500).json({ error: 'Error creating board' });
  }
};

module.exports = { createBoard };
