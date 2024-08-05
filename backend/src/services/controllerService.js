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
    return res.status(400).json({ error: 'Erro ao obter sala' });
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

module.exports = { createRoom, joinRoom };
