const roomsDb = require('../database');
const { findOneRoomDb, updateRoomDb } = require('./dbService');

const connectClient = (userName, userId, roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let room = await findOneRoomDb(roomId)
      const index = room.users.findIndex(item => item.userId === userId);
      if (index === -1) {
        resolve(await addUser(room, roomId, userId, userName));
      } else {
        resolve(room);
      }
    } catch (error) {
      reject(error)
    }
  });
};

const addUser = (room, roomId, userId, userName) => {
  return new Promise(async (resolve, reject) => {
    let user = {
      userId: userId,
      userName: userName,
      vote: 0,
      moderator: false
    };

    room.users.push(user);

    
    try {
      let roomUpd = await updateRoomDb(room, roomId)
      resolve(roomUpd)
    } catch (error) {
      reject(error)
    }

  });
};


const desconnectClient = (userId, roomId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let room = await findOneRoomDb(roomId)
      const index = room.users.findIndex(item => item.userId === userId);
      if (index !== -1) {
        resolve(await removeUser(room, index));
      } else {
        resolve(room);
      }
    } catch (error) {
      reject(error)
    }
  });
};


const removeUser = (room, index) => {
  return new Promise(async (resolve, reject) => {

    room.users.splice(index, 1);

    try {
      let roomUpd = await updateRoomDb(room, room._id)
      resolve(roomUpd)
    } catch (error) {
      reject(error)
    }
  });
};

const updateStatusRoom = (roomId, status) => {
  return new Promise(async (resolve, reject) => {
    try {
      let room = await findOneRoomDb(roomId)
      if (status == 'VOTACAO_ENCERRADA') {
        for (const key in room.users) {
          room.users[key].vote = 0
        }
      }
      room.status = status;
      let roomUpd = await updateRoomDb(room, room._id)
      resolve(roomUpd)
    } catch (error) {
      reject(error)
    }
  });
};

const updateVote = (roomId, userId, vote) => {
  return new Promise(async (resolve, reject) => {
    try {
      let room = await findOneRoomDb(roomId)
      const index = room.users.findIndex(item => item.userId === userId);
      if (index !== -1) {
        room.users[index].vote = vote
        let roomUpd = await updateRoomDb(room, room._id)
        resolve(roomUpd)
      } else {
        reject('Usuário inexistente');
      }
    } catch (error) {
      reject(error)
    }
  });
};

module.exports = { connectClient, desconnectClient, updateStatusRoom, updateVote };