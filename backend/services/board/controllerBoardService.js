require('dotenv').config();
const { DateTime } = require('luxon');
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');
const { putTable, getBoardDb, getBoardByUserDb, deleteBoardDb } = require('./dynamoBoardService');
const logger = require('../generic/cloudWatchLoggerService');
const timeZone = 'America/Sao_Paulo';

const createBoard = async (req, res) => {
  const start = performance.now()

  const boardDb = {
    boardId: uuidv4(),
    creatorId: req.body.creatorId,
    dateTime: DateTime.now().setZone(timeZone).toISO(),
    userName: req.body.userName,
    boardName: req.body.boardName,
    squadName: req.body.squadName,
    areaName: req.body.areaName,
    columns: req.body.columns,
    isObfuscated: false,
    dateTimeLastUpdate: DateTime.now().setZone(timeZone).toISO(),
    usersOnBoard: [],
    usersOnBoardHistoric: [],
    cardCreators: []
  };

  try {
    const data = await putTable(config.TABLE_BOARD, boardDb);
    res.status(201).json(data);
    const elapsedTime = (performance.now() - start).toFixed(3);
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
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
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
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