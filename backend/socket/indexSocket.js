const { connectClient, desconnectClient, updateStatusRoom, updateVote } = require('../services/poker/socketService');
const { connectClientRetro, addCardBoard, reorderBoard, processCombine, deleteColumn, updateTitleColumn, updateLike, deleteCard, saveCard, updatecolorCards, deleteAllCard } = require('../services/retro/socketRetroService');
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
    socket.on('comand_socket_retro', async (data) => {
      switch (data.comand) {
        case 'add_card_board':
          onAddCardBoard(data)
          break;
        case 'reorder_board':
          onReorderBoard(data)
          break;
        case 'combine_card':
          onCombineCard(data)
          break;
        case 'delete_column':
          onDeleteColumn(data)
          break;
        case 'update_title_column':
          onUpdateTitleColumn(data)
          break;
        case 'update_color_cards':
          onUpdateColorCards(data)
          break;
        case 'update_like':
          onUpdateLike(data)
          break;
        case 'delete_card':
          onDeleteCard(data)
          break;
        case 'delete_all_card':
          onDeleteAllCard(data)
          break;
        case 'save_card':
          onSaveCard(data)
          break;
        default:
          console.error('Comando não previsto - ', data.comand);
      }
    });

    async function onAddCardBoard(data) {
      const start = performance.now()
      try {
        let board = await addCardBoard(data.boardId, data.newCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onAddCardBoard', erro);
      }
    }

    async function onReorderBoard(data) {
      const start = performance.now()
      try {
        let board = await reorderBoard(data.boardId, data.source, data.destination);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onReorderBoard', erro);
      }
    }

    async function onCombineCard(data) {
      const start = performance.now()
      try {
        let board = await processCombine(data.boardId, data.source, data.combine);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onCombineBoard', erro);
      }
    }

    async function onDeleteColumn(data) {
      const start = performance.now()
      try {
        let board = await deleteColumn(data.boardId, data.index);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onDeleteColumn', erro);
      }
    }

    async function onUpdateTitleColumn(data) {
      const start = performance.now()
      try {
        let board = await updateTitleColumn(data.boardId, data.content, data.index);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onUpdateTitleColumn', erro);
      }
    }

    async function onUpdateColorCards(data) {
      const start = performance.now()
      try {
        let board = await updatecolorCards(data.boardId, data.colorCards, data.index);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onUpdateColorCards', erro);
      }
    }

    async function onUpdateLike(data) {
      const start = performance.now()
      try {
        let board = await updateLike(data.boardId, data.isIncrement, data.indexCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onUpdateLike', erro);
      }
    }

    async function onUpdateLike(data) {
      const start = performance.now()
      try {
        let board = await updateLike(data.boardId, data.isIncrement, data.indexCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onUpdateLike', erro);
      }
    }


    async function onDeleteCard(data) {
      const start = performance.now()
      try {
        let board = await deleteCard(data.boardId, data.indexCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onDeleteCard', erro);
      }
    }


    async function onDeleteAllCard(data) {
      const start = performance.now()
      try {
        let board = await deleteAllCard(data.boardId, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onDeleteAllCard', erro);
      }
    }


    async function onSaveCard(data) {
      const start = performance.now()
      try {
        let board = await saveCard(data.boardId, data.content, data.indexCard, data.indexColumn);
        io.to(data.boardId).emit('data_board', board);
      } catch (erro) {
        console.error('Erro ao combinar card', erro);
        console.error('Erro socket - onSaveCard', erro);
      }
    }

  });
};

module.exports = { setupSocketIo };