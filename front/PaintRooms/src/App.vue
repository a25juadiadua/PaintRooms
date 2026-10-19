<script setup>
import { ref } from 'vue';

import {io} from 'socket.io-client';
import Lobby from './components/Lobby.vue';
import Paint from './components/paint.vue';
import Swal from 'sweetalert2';



const entrarPaint = ref(false);
const nombreGuardado = localStorage.getItem("nombreUsuario");
const salaGuardada = localStorage.getItem("nombreSala");

const socket = io('http://localhost:3000');

socket.on ('connect', () =>{
  console.log('Conectado al servidor:' , socket.id);

  if (nombreGuardado != null && salaGuardada != null) {
        socket.emit("nombre:opcion:sala", nombreGuardado, true, salaGuardada);
    }
  
  
});

socket.on("nombre:ok", () => {
    entrarPaint.value = true;
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
    title: usuario,
    text: mensaje
  }).then(() => {
    window.location.reload();
  });
});


</script>

<template>

<Lobby v-if="entrarPaint === false" :socket = socket ></Lobby>
<Paint v-else :socket="socket " :swal = Swal />

</template>