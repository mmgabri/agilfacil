const express = require('express');
const { createRoom, joinRoom, suggestion, getRoom, healthcheck } = require('../services/poker/controllerService');
const { saveBoard, getBoardByUser, getBoard} = require('../services/retro/controllerRetroService');

const router = express.Router();

//poker
router.post('/createRoom', createRoom);
router.post('/joinRoom', joinRoom);
router.post('/suggestion', suggestion);
router.get('/rooms/:id', getRoom);
router.get('/healthcheck', healthcheck);

//retro
router.post('/retro/createBoard', saveBoard);
router.put('/retro/updateBoard', saveBoard);
router.get('/retro/getBoardByUser/:userId', getBoardByUser);
router.get('/retro/getBoard/:boardId', getBoard);

module.exports = router;