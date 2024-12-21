const { connectClient, desconnectClient, updateStatusRoom, updateVote } = require('../services/poker/socketService');
const { addCardBoard } = require('../services/retro/socketRetroService');
const logger = require('../services/generic/cloudWatchLoggerService');

const setupSocketIo = (io) => {

  io.on('connection', async (socket) => {
    const start = performance.now()
    console.log('A user connected:');
    const { userName, userId, idSession, service } = socket.handshake.query;

    console.log('service ==>', service, idSession)

    if (service === 'retro') {
      //TO DO
      console.log('trata retrospectiva')
      socket.join(idSession);
      io.to(idSession).emit('retro_connection', 'A user connected in retro');
    } else {
      try {
        let room = await connectClient(userName, userId, idSession);
        //throw new Error('Simulando erro');
        socket.join(idSession);
        io.to(idSession).emit('data_room', room);
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'connect', idSession, room.roomName, userId, userName, '', '', room.status, elapsedTime, 'success', 'Connect client successfully.')
      } catch (erro) {
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'connect', idSession, '', userId, userName, '', '', '', elapsedTime, 'failed', erro.message)
        console.error('Erro ao conectar client:', erro);
      }
    }

    socket.on('disconnect', async () => {
      const start = performance.now()
      console.log('A user disconnected:');
      const { userName, userId, idSession, service } = socket.handshake.query;

      console.log('service ==>', service, idSession)


      if (service === 'retro') {
        //TO DO
        console.log('trata retrospectiva')
        socket.join(idSession);
        io.to(idSession).emit('retro_disconnect', 'A user disconnected in retro');
      } else {
        try {
          let room = await desconnectClient(userId, idSession);
          io.to(idSession).emit('data_room', room);
          const elapsedTime = (performance.now() - start).toFixed(3);
          logger.log('SOCKET', 'disconnect', idSession, room.roomName, userId, userName, '', '', room.status, elapsedTime, 'success', 'Connect disconnect successfully.')
        } catch (erro) {
          const elapsedTime = (performance.now() - start).toFixed(3);
          logger.log('SOCKET', 'disconnect', idSession, '', userId, userName, '', '', '', elapsedTime, 'failed', erro.message)
          console.error('Erro ao desconectar client:', erro);
        }
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
        logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed', erro.message)
      }
    });

    // retro
    socket.on('add_card_board', async (data) => {
      const start = performance.now()
      console.info('add_card_board');

      try {
        let board = await addCardBoard(data.boardId, data.newCard);
        console.log('emit -->', board.id, board)
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao criar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });
  });
};

module.exports = { setupSocketIo };