<script setup>

import {io} from 'socket.io-client';
import Lobby from './components/Lobby.vue';




const socket = io('http://localhost:3000');

socket.on ('connect', () =>{
  console.log('Conectado al servidor:' , socket.id);
})
</script>

<template>
  <h1>PaintRooms</h1>

  <Lobby></Lobby>
</template>