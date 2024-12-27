const { connectClient, desconnectClient, updateStatusRoom, updateVote } = require('../services/poker/socketService');
const { connectClientRetro, addCardBoard, reorderBoard, processCombine, deleteColumn, updateTitleColumn, updateLike, deleteCard, saveCard } = require('../services/retro/socketRetroService');
const logger = require('../services/generic/cloudWatchLoggerService');

const setupSocketIo = (io) => {

  io.on('connection', async (socket) => {
    const start = performance.now()
    console.log('A user connected:');
    const { userName, userId, idSession, service } = socket.handshake.query;

    console.log('service ==>', service, idSession)

    if (service === 'retro') {
      console.log('trata retrospectiva')
      socket.join(idSession);

      try {
        let board = await connectClientRetro(idSession);
        io.to(idSession).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao combinar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
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
        let board = await addCardBoard(data.boardId, data.newCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao criar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });

    socket.on('reorder_board', async (data) => {
      const start = performance.now()
      console.info('reorder_board');

      try {
        let board = await reorderBoard(data.boardId, data.source, data.destination);
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao criar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });

    socket.on('combine_card', async (data) => {
      const start = performance.now()
      console.info('combine_card');

      try {
        let board = await processCombine(data.boardId, data.source, data.combine);
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao combinar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });


    socket.on('delete_column', async (data) => {
      const start = performance.now()
      console.info('delete_column');

      try {
        let board = await deleteColumn(data.boardId, data.index);
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao combinar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });


    socket.on('update_title_column', async (data) => {
      const start = performance.now()
      console.info('update_title_column');

      try {
        let board = await updateTitleColumn(data.boardId, data.content, data.index);
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao combinar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });



    socket.on('update_like', async (data) => {
      const start = performance.now()
      console.info('update_like');

      try {
        let board = await updateLike(data.boardId, data.isIncrement, data.indexCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao combinar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });



    socket.on('delete_card', async (data) => {
      const start = performance.now()
      console.info('delete_card');

      try {
        let board = await deleteCard(data.boardId, data.indexCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao combinar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });



    socket.on('save_card', async (data) => {
      const start = performance.now()
      console.info('save_card');

      try {
        let board = await saveCard(data.boardId, data.content, data.indexCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
        //   const elapsedTime = (performance.now() - start).toFixed(3);
        //   logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao combinar card', erro);
        //    logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed',  erro.message)
      }
    });

  });
};

module.exports = { setupSocketIo };