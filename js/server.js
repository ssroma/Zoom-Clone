// Server File
// bring in express. 
const express = require('express');
const app = express();
const server = require('http').Server(app);
// Bring in socket io and pass the express server. 
const io = require('socket.io')(server);

// Server will run on port 3000
server.listen(3000);

