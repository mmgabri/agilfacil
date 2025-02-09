require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { DateTime } = require('luxon');
const { putTable, getRoomDb } = require('./../database/dynamoService');
const config = require('../../config');
const logger = require('../generic/cloudWatchLoggerService');
const snsService = require('../generic/snsService');
const sns = new snsService('us-east-1');
const timeZone = 'America/Sao_Paulo';

const createRoom = async (req, res) => {
  const user = { userId: req.body.userId, nickName: req.body.nickName, vote: 0, };

  const roomDb = {
    roomId: uuidv4(),
    creatorId: req.body.userId,
    creatorName: req.body.userName,
    createdAt: DateTime.now().setZone(timeZone).toISO(),
    roomName: req.body.roomName,
    status: 'NOVA_VOTACAO',
    users: [user]
  };

  try {
    const data = await putTable(config.TABLE_ROOM, roomDb);
    res.status(201).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Error creating room' });
  }
};

const getRoom = async (req, res) => {
  const { id } = req.params

  try {
    const roomData = await getRoomDb(config.TABLE_ROOM, id);
    res.status(200).json(roomData);
  } catch (error) {
    if (error === 'NOT_FOUND') {
      return res.status(404).json({ error: 'Sala não encontrado' });
    } else {
      return res.status(500).json({ error: 'Error ao obter sala' });
    }
  }
};

const suggestion = async (req, res) => {
  const start = performance.now()
  console.log("suggestion");

  try {
    sns.suggestionNotification(req.body.userName, req.body.email, req.body.suggestion)
    res.status(200).json('sucess!');
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'suggestion', '', '', '', req.body.userName, '', '', '', elapsedTime, 'success', 'Suggestion created successfully.', req.body.email, req.body.suggestion,)
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'suggestion', '', '', '', req.body.userName, '', '', '', elapsedTime, 'success', 'Suggestion created successfully.', req.body.suggestion, req.body.suggestion)
    return res.status(500).json({ error: 'Error creating suggestion' });
  }
};


const healthcheck = async (req, res) => {
  console.log("Health Check OK");
  return res.status(200).json("Health Check OK");
};

module.exports = { createRoom, getRoom, healthcheck, suggestion };
