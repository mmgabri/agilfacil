const { connectClient, desconnectClient, updateStatusRoom, updateVote } = require('../services/socketService');
const logger = require('../services/cloudWatchLoggerService');

const setupSocketIo = (io) => {

  io.on('connection', async (socket) => {
    const start = performance.now()
    console.log('A user connected:');
    const { userName, userId, roomId } = socket.handshake.query;

    try {
      let room = await connectClient(userName, userId, roomId);
      //throw new Error('Simulando erro');
      socket.join(roomId);
      io.to(roomId).emit('data_room', room);
      const elapsedTime = (performance.now() - start).toFixed(3);
      logger.log('SOCKET', 'connect', roomId, room.roomName, userId, userName, '', '', room.status, elapsedTime, 'success', 'Connect client successfully.')
    } catch (erro) {
      const elapsedTime = (performance.now() - start).toFixed(3);
      logger.log('SOCKET', 'connect', roomId, '', userId, userName, '', '', '', elapsedTime, 'failed', erro.message)
      console.error('Erro ao conectar client:', erro);
    }

    socket.on('disconnect', async () => {
      const start = performance.now()
      console.log('A user disconnected:');
      const { userName, userId, roomId } = socket.handshake.query;
      try {
        let room = await desconnectClient(userId, roomId);
        io.to(roomId).emit('data_room', room);
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'disconnect', roomId, room.roomName, userId, userName, '', '', room.status, elapsedTime, 'success', 'Connect disconnect successfully.')
      } catch (erro) {
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'disconnect', roomId, '', userId, userName, '', '', '', elapsedTime, 'failed', erro.message)
        console.error('Erro ao desconectar client:', erro);
      }
    });

    socket.on('update_status_room', async (data) => {
      const start = performance.now()
      console.info('update_status_room');

      try {
        let room = await updateStatusRoom(roomId, data.status);
        io.to(roomId).emit('data_room', room);
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'update_status_room', room._id, room.roomName, '', '', '', '', room.status, elapsedTime, 'success', 'Update status room successfully.')
      } catch (erro) {
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'update_status_room', roomId, '', '', '', '', '', data.status, elapsedTime, 'failed', erro.message)
        console.error('Erro ao processar update_status_room', erro);
      }
    });

    socket.on('votar', async (data) => {
      const start = performance.now()
      console.info('votar');

      try {
        //throw new Error('Simulando erro');
        let room = await updateVote(data.roomId, data.userId, data.vote);
        io.to(roomId).emit('data_room', room);
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao processar votar', erro);
        logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });
  });
};

module.exports = { setupSocketIo };