const express = require('express');
const { validateToken } = require('../services/generic/validateToken'); 

const { createRoom, joinRoom, suggestion, getRoom, healthcheck } = require('../services/poker/controllerService');
const { createBoard, getBoardByUser, getBoard, deleteBoard} = require('../services/retro/controllerRetroService');

const router = express.Router();

// Poker - Rotas sem autenticação
router.post('/createRoom', createRoom);
router.post('/joinRoom', joinRoom);
router.post('/suggestion', suggestion);
router.get('/rooms/:id', getRoom);
router.get('/healthcheck', healthcheck);

// Retro - Rotas sem autenticação
router.get('/retro/:boardId', getBoard);

// Retro - Rotas com autenticação
router.get('/retro/getBoardByUser/:creatorId', validateToken, getBoardByUser);
router.post('/retro/createBoard', validateToken, createBoard);
router.delete('/retro/:boardId', validateToken, deleteBoard)
//router.put('/retro/updateBoard', validateToken, UpdateBoard);

module.exports = router;