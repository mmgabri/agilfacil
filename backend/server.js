require('dotenv').config();
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const socketIo = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const { PORT, CORS_OPTIONS } = require('./config');
const { setupSocketIo } = require('./socket/indexSocket');
const routes = require('./routes/indexRoutes');

const app = express();
let options = '';

console.log('ambiente:', process.env.NODE_ENV)

app.use(cors(CORS_OPTIONS));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use(routes);

if (process.env.NODE_ENV === 'prod') {
  // Carrega os certificados para HTTPS em produção
  options = {
    key: fs.readFileSync('/etc/letsencrypt/live/agilfacil.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/agilfacil.com/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/agilfacil.com/chain.pem'),
  };

  const httpsServer = https.createServer(options, app);
  httpsServer.listen(PORT, () => {
    console.log(`HTTPS Server is running on port ${PORT}`);
  });
  const io = socketIo(httpsServer, { cors: CORS_OPTIONS });
  setupSocketIo(io);
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(PORT, () => {
    console.log(`HTTP Server is running on port ${PORT}`);
  });
  const io = socketIo(httpServer, { cors: CORS_OPTIONS });
  setupSocketIo(io);
}