const express = require('express');
const { createRoom, joinRoom, getRoom, healthcheck } = require('../services/controllerService');

const router = express.Router();

router.post('/createRoom', createRoom);
router.post('/joinRoom', joinRoom);
router.get('/rooms/:id', getRoom);
router.get('/healthcheck', healthcheck);

module.exports = router;