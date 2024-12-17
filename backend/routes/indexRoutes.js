const express = require('express');
const { createRoom, joinRoom, suggestion, getRoom, healthcheck } = require('../services/poker/controllerService');

const router = express.Router();

router.post('/createRoom', createRoom);
router.post('/joinRoom', joinRoom);
router.post('/suggestion', suggestion);
router.get('/rooms/:id', getRoom);
router.get('/healthcheck', healthcheck);

module.exports = router;