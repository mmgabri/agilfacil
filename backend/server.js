const express = require('express');
const https = require('https');
const fs = require('fs');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT, CORS_OPTIONS } = require('./config');
const { setupSocketIo } = require('./socket');
const routes = require('./routes');

const app = express();

// Carrega os certificados
const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

const server = https.createServer(options, app);

const io = socketIo(server, { cors: CORS_OPTIONS });

app.use(cors(CORS_OPTIONS));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(routes);

setupSocketIo(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});