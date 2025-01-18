require('dotenv').config();
const config = require('../../config');
const { v4: uuidv4 } = require('uuid');
const { putTable, getBoardDb, getBoardByUserDb } = require('./dynamoRetroService');
const logger = require('../generic/cloudWatchLoggerService');

const saveBoard = async (req, res) => {
  const start = performance.now()

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
    boardId: boardId,
    creatorId: req.body.creatorId,
    dateTime: dateTime,
    userName: req.body.userName,
    boardName: req.body.boardName,
    squadName: req.body.squadName,
    areaName: req.body.areaName,
    columns: req.body.columns,
    isObfuscated: false,
    dateTimeLastUpdate: new Date().toISOString(),
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


const userOnBoard = async (req, res) => {
  const start = performance.now()
  console.log("userOnBoard");

  try {
    // Obtém os dados do board no banco de dados
    const boardData = await getBoardDb(config.TABLE_BOARD, req.body.boardId);

    const userData = { userId: req.body.userId }

    // Adiciona usuário na lista de usuários
    const updatedBoardData = { ...boardData };
    const userExists = updatedBoardData.usersOnBoard.some(user => user.userId === userData.userId);
    if (userExists) return res.status(201).json({ message: 'sucess!' });

    updatedBoardData.usersOnBoard.push(userData);
    await putTable(config.TABLE_BOARD, updatedBoardData);
    return res.status(201).json({ message: 'sucess!' });

  } catch (error) {
    if (error == 'NOT_FOUND') {
      return res.status(404).json({ error: 'Board não encontrado' });
    } else {
      return res.status(500).json({ error: 'Error in userOnBoard' });
    }
  }

};

const getBoard = async (req, res) => {
  const start = performance.now()

  console.log("getBoard");

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

  console.log("getBoardByUser");

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

module.exports = { saveBoard, getBoardByUser, getBoard, userOnBoard };