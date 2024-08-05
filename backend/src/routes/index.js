const express = require('express');
const { createRoom, joinRoom, getRoom } = require('../services/controllerService');

const router = express.Router();

router.post('/createRoom', createRoom);
router.post('/joinRoom', joinRoom);

module.exports = router;