<script setup>
import { ref, onMounted } from 'vue';

const canvas = ref(null);

const props = defineProps(['socket']);

let ctx = null;

let estaDibujando = false;

const nombreRoom = ref("");
const maxPlayers = ref(0);
const users = ref([]);
const countPlayer = ref(0);
const posX = ref(0);
const posY = ref(0);
const cursores = ref({});


// ------------------------------- FUNCIONES -----------------------------

function ajustarCanvas() {
    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;
}

function empezarDibujo(event){
    estaDibujando = true;
    
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);

    props.socket.emit('dibujo:inicio', {
    x: event.offsetX,
    y: event.offsetY
});
}

function moverDibujo(event){

    if(estaDibujando){

        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();

        props.socket.emit('dibujo:mover', {
            x: event.offsetX,
            y: event.offsetY
        });
    }

        props.socket.emit('cursor:mover', {
            x: event.offsetX,
            y: event.offsetY
        });
    
}

function terminarDibujo(){
    estaDibujando = false;
}

//-------------------------------- OnMounted -------------------------------

onMounted (() => {
    console.log("El canva ya esta montado");

    ajustarCanvas();

    window.addEventListener("resize", ajustarCanvas);
    window.addEventListener("mouseup", terminarDibujo);

    ctx = canvas.value.getContext("2d");

    props.socket.on('dibujo:inicio', (datos) => {
        ctx.beginPath();
        ctx.moveTo(datos.x, datos.y);
    });

    props.socket.on('dibujo:mover', (datos) => {
        
        ctx.lineTo(datos.x, datos.y);
        ctx.stroke();
    });

    props.socket.on("info:sala",( nombreSala, jugadoresSala, maxJuagdor, usarios) => {
        nombreRoom.value = nombreSala;
        maxPlayers.value = maxJuagdor;
        users.value = usarios;
        countPlayer.value = jugadoresSala;
    });

    props.socket.on("cursor:mover", (datos) =>{
        cursores.value[datos.id] = {
            nombre: datos.nombre,
            posX: datos.posX,
            posY: datos.posY
        };
        

    });

})
</script>

<template>

    <div class="canvas-container">

        <canvas ref="canvas"
        @mousedown="empezarDibujo"
        @mousemove="moverDibujo"
        @mouseup="terminarDibujo()">
    </canvas>
    

    <div class="cursor-layer">
        <div v-for="(cursor, id) in cursores" :key="id"
            class="cursor"
            :style="{ left: cursor.posX + 'px', top: cursor.posY + 'px' }">
        {{ cursor.nombre }}</div>
    </div>
</div>


    <nav>
        <p>Nom Sala: {{ nombreRoom }}</p>
        <p>Maxim jugadors: {{ maxPlayers }}</p>
        <p>Jugadors: {{ countPlayer }}</p>
    </nav>


</template>

<style scoped>
canvas {
  display: block;
  width: 100vw;
  height: 100vh;
}

.canvas-container {
    position: relative;
}

.cursor-layer {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
}

.cursor {
    position: absolute;
    background: yellow;
    padding: 2px 5px;
    font-size: 12px;
}
</style>