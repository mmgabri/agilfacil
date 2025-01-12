const { connectClient, desconnectClient, updateStatusRoom, updateVote } = require('../services/poker/socketService');
const { connectClientRetro, addCardBoard, reorderBoard, processCombine, deleteColumn, updateTitleColumn, updateLike, deleteCard, saveCard, updatecolorCards, deleteAllCard } = require('../services/retro/socketRetroService');
const logger = require('../services/generic/cloudWatchLoggerService');

const setupSocketIo = (io) => {

  io.on('connection', async (socket) => {
    const { userName, userId, idSession, service } = socket.handshake.query;

    switch (service) {
      case 'board':
        onConnectBoard(idSession)
        break;
      case 'poker':
        onConnectPoker(userName, userId, idSession)
        break;
      default:
        console.error('Connect - Service não previsto - ', service);
    }

    socket.on('disconnect', async () => {
      const { userName, userId, idSession, service } = socket.handshake.query;

      switch (service) {
        case 'board':
          onDisconnectBoard(idSession)
          break;
        case 'poker':
          onDisconnectPoker(userName, userId, idSession)
          break;
        default:
          console.error('Disconnect - Service não previsto - ', service);
      }
    });

    socket.on('comand_socket_poker', async (data) => {
      switch (data.comand) {
        case 'update_status_room':
          onUpdateStatusRoom(data)
          break;
        case 'votar':
          onVotar(data)
          break;
        default:
          console.error('Comando Poker não previsto - ', data.comand);
      }
    });

    socket.on('comand_socket_board', async (data) => {
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
          console.error('Comando Board não previsto - ', data.comand);
      }
    });

    //functions Board
    async function onConnectBoard(idSession) {
      const start = performance.now()
      try {
        let board = await connectClientRetro(idSession);
        socket.join(idSession);
        io.to(idSession).emit('data_board', board);
      } catch (erro) {
        console.error('Erro socket - onConnectBoard: ', erro);
      }
    }

    async function onConnectPoker(userName, userId, idSession) {
      const start = performance.now()
      try {
        let room = await connectClient(userName, userId, idSession);
        socket.join(idSession);
        io.to(idSession).emit('data_room', room);
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'connect', idSession, room.roomName, userId, userName, '', '', room.status, elapsedTime, 'success', 'Connect client successfully.')
      } catch (erro) {
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'connect', idSession, '', userId, userName, '', '', '', elapsedTime, 'failed', erro.message)
        console.error('Erro socket - onConnectPoker: ', erro);
      }
    }

    async function onDisconnectBoard(idSession) {
      const start = performance.now()
      //TO DO
      console.log('trata retrospectiva')
      socket.join(idSession);
      io.to(idSession).emit('retro_disconnect', 'A user disconnected in retro');
    }

    async function onDisconnectPoker(userName, userId, idSession) {
      const start = performance.now()
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
        console.error('Erro socket - onSaveCard', erro);
      }
    }

    //functions Poker 
    async function onUpdateStatusRoom(data) {
      const start = performance.now()
      try {
        let room = await updateStatusRoom(data.roomId, data.status);
        io.to(data.roomId).emit('data_room', room);
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'update_status_room', room._id, room.roomName, '', '', '', '', room.status, elapsedTime, 'success', 'Update status room successfully.')
      } catch (erro) {
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'update_status_room', data.roomId, '', '', '', '', '', data.status, elapsedTime, 'failed', erro.message)
        console.error('Erro ao processar update_status_room', erro);
      }
    }

    async function onVotar(data) {
      const start = performance.now()
      try {
        let room = await updateVote(data.roomId, data.userId, data.vote);
        io.to(data.roomId).emit('data_room', room);
        const elapsedTime = (performance.now() - start).toFixed(3);
        logger.log('SOCKET', 'votar', data.roomId, room.roomName, data.userId, data.userName, '', data.vote, room.status, elapsedTime, 'success', 'Vote successfully.')
      } catch (erro) {
        console.error('Erro ao processar votar', erro);
        logger.log('SOCKET', 'votar', data.roomId, '', data.userId, data.userName, '', data.vote, '', '', 'failed', erro.message)
      }
    }

  });
};

module.exports = { setupSocketIo };