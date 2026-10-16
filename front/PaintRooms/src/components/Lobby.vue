<script setup>
import {ref} from 'vue';

let username = ref("");
let roomname = ref("");

</script>
<template>
    <h1>PaintRooms</h1>

    <form @submit.prevent="guardarDatos" >

        <label for="nom">Nom d'Usuari:</label>
        <input type="text" name="nom" id="inputNom" v-model="username">

        <label for="sala">Nom de la sala:</label>
        <input type="text" name="sala" id="inputSala" v-model="roomname">

        <button>Entrar</button>
    </form>
</template>