const express = require('express');
const { validateToken } = require('../services/generic/validateToken'); 

const { createRoom, suggestion, getRoom, healthcheck } = require('../services/poker/controllerPokerService');
const { createBoard, getBoardByUser, getBoard, deleteBoard} = require('../services/board/controllerBoardService');

const router = express.Router();

// Rotas sem autenticação
router.post('/suggestion', suggestion);
router.get('/healthcheck', healthcheck);
router.get('/rooms/:id', getRoom);
router.get('/board/:boardId', getBoard);

// Rotas com autenticação
router.post('/poker/createRoom', validateToken, createRoom);
router.post('/board/createBoard', validateToken, createBoard);
router.get('/board/getBoardByUser/:creatorId', validateToken, getBoardByUser);
router.delete('/board/:boardId', validateToken, deleteBoard)

module.exports = router;