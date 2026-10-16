const express = require('express');
const { createServer } = require('node:http');
const { Server } = require('socket.io');

const PORT = 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

io.on('connection', (socket) => {
    console.log('Usuario conectado');
});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});