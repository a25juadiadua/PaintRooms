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


    // ---------------------- COMPROBACION DE ERRORES Y CREACION DE SALA Y USUARIOS ------------------------------
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
                Usuarios : new Map(),
                Dibujos: []
            };

            Salas[sala].Usuarios.set(socket.id, nombre);
            socket.join(sala);
            
            socket.emit("nombre:ok");
            io.to(sala).emit("info:sala", sala, Salas[sala].Users, Salas[sala].MaxPlayer, Salas[sala].Usuarios);


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
        else if(Salas[sala].Users >= Salas[sala].MaxPlayer){
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

            socket.join(sala);
            socket.emit("nombre:ok");
            socket.emit("datos:sala", Salas[sala].Dibujos);
            io.to(sala).emit("info:sala", sala, Salas[sala].Users, Salas[sala].MaxPlayer, Salas[sala].Usuarios,);

            console.log("-------------------------------------------------------");
            console.log("Usuarios: " , Usuarios);
            console.log("-------------------------------------------------------------------");
            console.log("Salas: " , Salas);
        }
    }
    });


    //------------------------------------- ENVIAR LAS CORDENADAS A LA SALA CORRESPONDIENTE --------------------
    socket.on('dibujo:inicio', (datos) => {

        if(Usuarios[socket.id]){

            let x = datos.x;
            let y = datos.y;
    
            let sala = Usuarios[socket.id].room;
            Salas[sala].Dibujos.push({X: x,
                 Y: y,
                Inicio: true,
                Usuario: socket.id});

            io.to(sala).emit('dibujo:inicio',{ x, y});
        }else{
            socket.emit(
        "error:usuario",
        "Usuario desconocido",
        "Ha habido un error con el usuario"
    );
        }
});

    socket.on('dibujo:mover', (datos) => {

        if(Usuarios[socket.id]){

            let x = datos.x;
            let y = datos.y;
        
            let sala = Usuarios[socket.id].room;
            
            Salas[sala].Dibujos.push({X: x,
                 Y: y,
                Inicio: false,
                Usuario: socket.id});

            io.to(sala).emit('dibujo:mover', { x, y });
        }else{
            socket.emit(
        "error:usuario",
        "Usuario desconocido",
        "Ha habido un error con el usuario"
    );
        }
});



socket.on("cursor:mover", (datos) => {

    if(Usuarios[socket.id]) {
        let x = datos.x;
            let y = datos.y;
        
            let sala = Usuarios[socket.id].room;
        
            io.to(sala).emit('cursor:mover', {
                id: socket.id,
                nombre: Usuarios[socket.id].name,
                posX: x,
                posY: y});
        }else{
            socket.emit(
        "error:usuario",
        "Usuario desconocido",
        "Ha habido un error con el usuario"
    );
    }
});

socket.on("dibujo:borrar", () => {

    

        let sala = Usuarios[socket.id].room;
    
        Salas[sala].Dibujos = Salas[sala].Dibujos.filter(dibujo => dibujo.Usuario !== socket.id);
    
        io.to(sala).emit("dibujo:borrar", Salas[sala].Dibujos);
    
});


    //------------------------------------- DESCONEXION DE USUARIO ---------------------------------------

    socket.on("disconnect", () => {

        if (Usuarios[socket.id]) {
            sala = Usuarios[socket.id].room;

            console.log("Sala encontrada");
            io.to(sala).emit("cursor:eliminar", (socket.id));

            if(Usuarios[socket.id].adminSala === true && Salas[sala].Users >= 2){

                Salas[sala].Usuarios.delete(socket.id);
                Salas[sala].Users--;

                const idSiguienteAdmin = Salas[sala].Usuarios.keys().next().value;

                Usuarios[idSiguienteAdmin].adminSala = true;

                console.log("Usuario eliminado y nuevo admin en la sala y contador de sala borrados");

            }else{

                Salas[sala].Usuarios.delete(socket.id);
                Salas[sala].Users--;
                console.log("Usuario eliminado de la sala y contador de sala borrados");
            }


        
        if(Salas[sala].Users <= 0){
            delete Salas[sala];
            console.log("Sala borrada porque no hay jugadores");
            
        }else{
            
            io.to(sala).emit("info:sala", sala, Salas[sala].Users, Salas[sala].MaxPlayer, Salas[sala].Usuarios);
        }
        

        delete Usuarios[socket.id];
        console.log("Usuario borrado");
        }
        

    });



});

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});