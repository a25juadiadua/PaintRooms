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

let Usuarios = {};
let Salas = {};


io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on("nombre:opcion:sala", (nombre, opcionSala, sala) => {
    console.log(nombre, opcionSala, sala);

    if (opcionSala === false) {

        

        if(!Salas[sala]){

            Usuarios[socket.id] = {
                name: nombre,
                room: sala,
                adminSala: true
            };

            Salas[sala] = {
                Users : 1,
                MaxPlayer: 5,
                Usuarios : new Map()
                
            };

            Salas[sala].Usuarios.set(socket.id, nombre);

            console.log("-------------------------------------------------------");
            console.log("Usuarios: " , Usuarios);
            console.log("-------------------------------------------------------");
            console.log("Salas: " , Salas);

        }else{
            socket.emit("error:sala", sala, "No s'ha pogut fer la sala perque ja esta creada");
            console.log("No se ha creado la sala porque ya esta creada de antes");
        }

    }else{


        if(!Salas[sala]){
                
                socket.emit("error:sala", sala, "No s'ha encontrat la sala");
                console.log("Sala no encontrada y usuario no añadido");
            }
        else if(Salas[sala].Users > Salas[sala].MaxPlayer){
                socket.emit("error:sala", sala, "La sala esta al maxim de jugadors");
                console.log("Sala encontrada pero supera el limite de jugadores");
            }

        else{

            Usuarios[socket.id] = {
                name: nombre,
                room: sala,
                adminSala: false
            };

            Salas[sala].Usuarios.set(socket.id, nombre);
            Salas[sala].Users++;

            console.log("-------------------------------------------------------");
            console.log("Usuarios: " , Usuarios);
            console.log("-------------------------------------------------------------------");
            console.log("Salas: " , Salas);
        }
    }
    });

    socket.on("disconnect", (sala) => {

        if (Usuarios[socket.id]) {
            sala = Usuarios[socket.id].room;

            console.log("Sala encontrada");
        Salas[sala].Usuarios.delete(socket.id);
        Salas[sala].Users--;
        console.log("Usuario eliminado de la sala y contador de sala borrados");

        if(Salas[sala].Users <= 0){
            delete Salas[sala];
            console.log("Sala borrada porque no hay jugadores");
        }

        delete Usuarios[socket.id];
        console.log("Usuario borrado");
        }
        

    });



});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});