const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT, CORS_OPTIONS } = require('./config');
const { setupSocketIo } = require('./socket');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: CORS_OPTIONS });

app.use(cors(CORS_OPTIONS));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(routes);

setupSocketIo(io);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
