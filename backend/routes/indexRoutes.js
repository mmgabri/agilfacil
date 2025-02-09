const express = require('express');
const { validateToken } = require('../services/generic/validateToken'); 

const { createRoom, joinRoom, suggestion, getRoom, healthcheck } = require('../services/poker/controllerService');
const { createBoard, getBoardByUser, getBoard, deleteBoard} = require('../services/board/controllerBoardService');

const router = express.Router();

// Poker - Rotas sem autenticação
router.post('/createRoom', createRoom);
router.post('/joinRoom', joinRoom);
router.post('/suggestion', suggestion);
router.get('/rooms/:id', getRoom);
router.get('/healthcheck', healthcheck);

// Board - Rotas sem autenticação
router.get('/board/:boardId', getBoard);

// Board - Rotas com autenticação
router.get('/board/getBoardByUser/:creatorId', validateToken, getBoardByUser);
router.post('/board/createBoard', validateToken, createBoard);
router.delete('/board/:boardId', validateToken, deleteBoard)
//router.put('/board/updateBoard', validateToken, UpdateBoard);

module.exports = router;