<script setup>
import { ref, onMounted } from 'vue';

const canvas = ref(null);

const props = defineProps(['socket']);

let ctx = null;

let estaDibujando = false;



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

})
</script>

<template>
  <canvas ref="canvas"
   @mousedown="empezarDibujo"
   @mousemove="moverDibujo"
   @mouseup="terminarDibujo()"
   ></canvas>
</template>

<style scoped>
canvas {
  display: block;
  width: 100vw;
  height: 100vh;
}
</style>