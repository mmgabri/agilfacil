const { connectClient, desconnectClient, updateStatusRoom, updateVote } = require('../services/socketService');

const setupSocketIo = (io) => {
  io.on('connection', async (socket) => {
    console.log('A user connected:', socket.id, socket.handshake.query);
    const { userName, userId, roomId } = socket.handshake.query;

    try {
      let room = await connectClient(userName, userId, roomId);
      socket.join(roomId);
      io.to(roomId).emit('data_room', room);
    } catch (erro) {
      console.error('Erro ao conectar client:', erro);
    }

    socket.on('disconnect', async () => {
      console.log('A user disconnected:', socket.id, socket.handshake.query);
      const { userName, userId, roomId } = socket.handshake.query;
      try {
        let room = await desconnectClient(userId, roomId);
        io.to(roomId).emit('data_room', room);
      } catch (erro) {
        console.error('Erro ao desconectar client:', erro);
      }
    });

    socket.on('update_status_room', async (data) => {
      console.info('update_status_room', data);

      try {
        let room = await updateStatusRoom(roomId, data.status);
        io.to(roomId).emit('data_room', room);
      } catch (erro) {
        console.error('Erro ao processar update_status_room', erro);
      }
    });

    socket.on('votar', async (data) => {
      console.info('votar', data);

      try {
        let room = await updateVote(data.roomId, data.userId, data.vote);
        io.to(roomId).emit('data_room', room);
      } catch (erro) {
        console.error('Erro ao processar votar', erro);
      }  
    });
  });
};

module.exports = { setupSocketIo };