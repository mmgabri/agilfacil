const { v4: uuidv4 } = require('uuid');
const { insertRoomDb, findOneRoomDb, updateRoomDb } = require('./dbService');

const createRoom = async (req, res) => {
  console.log("createRoom");

  let user = {
    userId: uuidv4(),
    userName: req.body.userName,
    vote: 0,
    moderator: true
  };

  let room = {
    roomName: req.body.roomName,
    status: 'AGUARDANDO_LIBERACAO',
    users: [user]
  };

  try {
    let newRoom = await insertRoomDb(room);
    res.status(201).json({ roomId: newRoom._id, roomName: room.roomName, userId: user.userId, userName: user.userName, moderator: user.moderator });
  } catch (error) {
    return res.status(500).json({ error: 'Error creating room' });
  }
};


const joinRoom = async (req, res) => {
  console.log("joinRoom - roomId: ", req.body.roomId);

  let room = null;

  try {
    room = await findOneRoomDb(req.body.roomId)
  } catch (error) {
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
    let roomUpd = await updateRoomDb(room, req.body.roomId)
    res.status(201).json({ roomId: roomUpd._id, roomName: roomUpd.roomName, userId: user.userId, userName: user.userName, moderator: user.moderator });
  } catch (error) {
    return res.status(400).json({ error: 'Erro ao obter sala' });
  }

};

const getRoom = async (req, res) => {
  const { id } = req.params
  console.log("getRoom - roomId: ", id);

  try {
    const room = await findOneRoomDb(id)
    return res.status(200).json(room);
  } catch (error) {
    console.log('Erro ao consultar room:', error)
    return res.status(error.statusCode).json({ error: error.message });
  }

};

const healthcheck = async (req, res) => {
  console.log("Health Check OK");
  return res.status(200).json("Health Check OK");
};

module.exports = { createRoom, joinRoom, getRoom, healthcheck };
