const roomsDb = require('../database');

const insertRoomDb = (room) => {
  return new Promise((resolve, reject) => {
    roomsDb.insert(room, (err, newRoom) => {
      if (err) {
        console.error('Erro ao inserir sala em roomDb ==>', err);
        reject('Erro ao inserir sala em roomDb');
      } else if (newRoom) {
        console.log(`Sala ${newRoom._id} criada com sucesso!` );
        resolve(newRoom);
      } else {
        reject('Erro ao inserir sala em roomDb');
      }
    });
  });
};


const findOneRoomDb = (roomId) => {
  return new Promise((resolve, reject) => {
    roomsDb.findOne({ _id: roomId }, (err, room) => {
      if (err) {
        console.error('Erro ao buscar sala ==>', err);
        reject('Erro ao buscar sala');
      } else if (room) {
        resolve(room);
      } else {
        reject('Sala inexistente');
      }
    });
  });
};

const updateRoomDb = (room, roomId) => {
  return new Promise((resolve, reject) => {
    roomsDb.update(
      { _id: roomId },
      { $set: room },
      { multi: false },
      (err, numAffected) => {
        if (err) {
          console.error('Erro ao atualizar roomDb ==>', err);
          reject('Erro ao atualizar roomDb');
        } else {
          console.log(`Número de registros atualizados: ${numAffected}`);
          resolve(room);
        }
      });
  });
};

module.exports = { insertRoomDb, findOneRoomDb, updateRoomDb };