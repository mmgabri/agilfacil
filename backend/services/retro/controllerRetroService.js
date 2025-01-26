require('dotenv').config();
const { DateTime } = require('luxon');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');
const { putTable, getBoardDb, getBoardByUserDb, deleteBoardDb } = require('./dynamoRetroService');
const logger = require('../generic/cloudWatchLoggerService');
const timeZone = 'America/Sao_Paulo';

const createBoard = async (req, res) => {
  const start = performance.now()
  const brasiliaTime = DateTime.now().setZone(timeZone);
  const formattedTime = brasiliaTime.toFormat("dd/MM/yyyy HH:mm:ss");

  const boardDb = {
    boardId: uuidv4(),
    creatorId: req.body.creatorId,
    dateTime: formattedTime,
    userName: req.body.userName,
    boardName: req.body.boardName,
    squadName: req.body.squadName,
    areaName: req.body.areaName,
    columns: req.body.columns,
    isObfuscated: false,
    dateTimeLastUpdate: formattedTime,
    usersOnBoard: [],
    cardCreators: []
  };

  try {
    const data = await putTable(config.TABLE_BOARD, boardDb);
    res.status(201).json(data);
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

  const { boardId } = req.params

  try {
    const dataItems = await getBoardDb(config.TABLE_BOARD, boardId);
    res.status(200).json(dataItems);
    const elapsedTime = (performance.now() - start).toFixed(3);
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

    const { creatorId } = req.params

  try {
    const dataItems = await getBoardByUserDb(config.TABLE_BOARD, config.INDEX_NAME_USER, creatorId);
    res.status(200).json(dataItems);
    const elapsedTime = (performance.now() - start).toFixed(3);
    //  logger.log('API-RETRO', 'getBoardByUser', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName,  '', elapsedTime, 'success', 'Get board successfully.' )
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    //   logger.log('API-RETRO', 'getBoardByUser', obj.boardId, obj.boardName, obj.user_id, obj.userName, obj.squadName, obj.areaName,  '', elapsedTime, 'failed', error.message )
    return res.status(500).json({ error: 'Error creating board' });
  }
};

const deleteBoard = async (req, res) => {
  const start = performance.now()

  const { boardId } = req.params

  try {
    const board = await getBoardDb(config.TABLE_BOARD, boardId);
    await deleteBoardDb(config.TABLE_BOARD, boardId, board.dateTime);
    res.status(204).json("sucess!");
    //const elapsedTime = (performance.now() - start).toFixed(3);
  } catch (error) {
    //const elapsedTime = (performance.now() - start).toFixed(3);
    if (error === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Board não encontrado' });
    } else {
      return res.status(500).json({ error: 'Error ao deletar board' });
    }
  }
};

module.exports = { createBoard, getBoardByUser, getBoard, deleteBoard };