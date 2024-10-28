const { v4: uuidv4 } = require('uuid');
const { insertRoomDb, findOneRoomDb, updateRoomDb } = require('./dbService');
const logger = require('./cloudWatchLoggerService');
const snsService = require('./SnsService');
const sns = new snsService('us-east-1');

const createRoom = async (req, res) => {
  const start = performance.now()
  console.log("createRoom");

  let user = {
    userId: uuidv4(),
    userName: req.body.userName,
    vote: 0,
    moderator: true
  };

  let room = {
    roomName: req.body.roomName,
    status: 'NOVA_VOTACAO',
    users: [user]
  };

  try {
    let newRoom = await insertRoomDb(room);
    res.status(201).json({ roomId: newRoom._id, roomName: room.roomName, userId: user.userId, userName: user.userName, moderator: user.moderator });
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'createRoom', newRoom._id, room.roomName, user.userId, user.userName, user.moderator, user.vote,  room.status, elapsedTime, 'success', 'Room created successfully.' )
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'createRoom', '', room.roomName, user.userId, user.userName, user.moderator, user.vote, room.status, elapsedTime, 'failed', error.message )
    return res.status(500).json({ error: 'Error creating room' });
  }
};


const joinRoom = async (req, res) => {
  const start = performance.now()
  console.log("joinRoom - roomId: ", req.body.roomId);

  let room = null;

  try {
    room = await findOneRoomDb(req.body.roomId)
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'joinRoom', req.body.roomId, '', '', req.body.userName, false, 0, '', elapsedTime, 'failed', error.message)
    return res.status(error.statusCode).json({ error: error.message });
  }

  let user = {
    userId: uuidv4(),
    userName: req.body.userName,
    vote: 0,
    moderator: false
  };

  room.users.push(user);

  try {
    //throw new Error('Something went wrong!');
    let roomUpd = await updateRoomDb(room, req.body.roomId)
    res.status(201).json({ roomId: roomUpd._id, roomName: roomUpd.roomName, userId: user.userId, userName: user.userName, moderator: user.moderator });
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'joinRoom', roomUpd._id, room.roomName, user.userId, user.userName, user.moderator, user.vote,  room.status, elapsedTime, 'success', 'User join successfully.' )
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'joinRoom', room._id, room.roomName, user.userId, user.userName, user.moderator, user.vote, room.status, elapsedTime, 'failed', error.message )
    return res.status(400).json({ error: 'Erro ao obter sala' });
  }

};

const getRoom = async (req, res) => {
  const start = performance.now()

  const { id } = req.params
  console.log("getRoom - roomId: ", id);

  try {
    const room = await findOneRoomDb(id)
    res.status(200).json(room);
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'getRoom', room._id, room.roomName, '', '', '', '',  room.status, elapsedTime, 'success', 'Room get successfully.' )
  } catch (error) {
    console.log('Erro ao consultar room:', error)
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'getRoom', id, '', '', '', '', '',  '', elapsedTime, 'failed', error.message )
    return res.status(error.statusCode).json({ error: error.message });
  }

};

const suggestion = async (req, res) => {
  const start = performance.now()
  console.log("suggestion");

  try {
    sns.suggestionNotification(req.body.userName, req.body.email, req.body.suggestion )
    res.status(200).json('sucess!');
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'suggestion', '', '', '', req.body.userName, '', '',  '', elapsedTime, 'success', 'Suggestion created successfully.',  req.body.email, req.body.suggestion, )
  } catch (error) {
    const elapsedTime = (performance.now() - start).toFixed(3);
    logger.log('API', 'suggestion', '', '', '', req.body.userName, '', '',  '', elapsedTime, 'success', 'Suggestion created successfully.', req.body.suggestion, req.body.suggestion )
    return res.status(500).json({ error: 'Error creating suggestion' });
  }
};


const healthcheck = async (req, res) => {
  console.log("Health Check OK");
  return res.status(200).json("Health Check OK");
};

module.exports = { createRoom, joinRoom, getRoom, healthcheck, suggestion };