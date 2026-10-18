<script setup>

import {io} from 'socket.io-client';
import Lobby from './components/Lobby.vue';
import Paint from './components/paint.vue';
import Swal from 'sweetalert2';




const socket = io('http://localhost:3000');

socket.on ('connect', () =>{
  console.log('Conectado al servidor:' , socket.id);

  
});

socket.on("error:sala", (sala, mensaje) => {
  Swal.fire({
    icon: 'error',
    title: `Error con la sala ${sala}`,
    text: mensaje
  });

});


socket.on("error:usuario", (usuario, mensaje) => {
  Swal.fire({
    icon: 'error',
    title: `${usuario}`,
    text: mensaje
  });

})
</script>

<template>

<Lobby :socket = socket></Lobby>
<Paint :socket="socket" />

</template>