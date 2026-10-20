<script setup>
import { ref, onMounted } from 'vue';

const canvas = ref(null);

const props = defineProps(['socket', 'swal']);

let ctx = null;

let estaDibujando = false;

const nombreRoom = ref("");
const maxPlayers = ref(0);
const users = ref([]);
const countPlayer = ref(0);
const cursores = ref({});
const posX = ref(0);
const posY = ref(0);
let ultimaX = 0;
let ultimaY = 0;


setInterval(() => {
    if (posX.value !== ultimaX || posY.value !== ultimaY) {


        props.socket.emit('cursor:mover', {
            x: posX.value,
            y: posY.value
        });

        ultimaX = posX.value;
        ultimaY = posY.value;
    }
}, 50);


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
    
    posX.value = event.offsetX;
    posY.value = event.offsetY;
}

function terminarDibujo(){
    estaDibujando = false;
}


    
function desconectarUsuario() {

    props.swal.fire({
        title: "¿Estás seguro?",
        text: "Volverás al inicio de la página",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem("nombreUsuario");
            localStorage.removeItem("nombreSala");

            props.socket.disconnect();
            window.location.reload();
        }
    });
}

function borrar(){
    
    props.socket.emit("dibujo:borrar");
}

//-------------------------------- OnMounted -------------------------------

onMounted (() => {
    console.log("El canva ya esta montado");

    ajustarCanvas();

    window.addEventListener("resize", ajustarCanvas);
    window.addEventListener("mouseup", terminarDibujo);

    ctx = canvas.value.getContext("2d");


    props.socket.on("datos:sala",(datos) => {
        
        
        datos.forEach((element) => {
            
            if(element.Inicio === true){
                ctx.beginPath();
                ctx.moveTo(element.X, element.Y);

            }else{

                ctx.lineTo(element.X, element.Y);
                ctx.stroke();
            }
        });

    });


    props.socket.on('dibujo:inicio', (datos) => {
        ctx.beginPath();
        ctx.moveTo(datos.x, datos.y);
    });

    props.socket.on('dibujo:mover', (datos) => {
        
        ctx.lineTo(datos.x, datos.y);
        ctx.stroke();
    });

    props.socket.on("dibujo:borrar", (datos) => {


        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        
        datos.forEach((element) => {
            
            if(element.Inicio === true){
                ctx.beginPath();
                ctx.moveTo(element.X, element.Y);

            }else{

                ctx.lineTo(element.X, element.Y);
                ctx.stroke();
            }
        });

    

    });

    props.socket.on("info:sala",( nombreSala, jugadoresSala, maxJuagdor, usarios) => {
        nombreRoom.value = nombreSala;
        maxPlayers.value = maxJuagdor;
        users.value = usarios;
        countPlayer.value = jugadoresSala;
    });

   props.socket.on("cursor:mover", (datos) => {
    let color;

    if (cursores.value[datos.id]) {
        color = cursores.value[datos.id].color;
    } else {
        color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    cursores.value[datos.id] = {
        nombre: datos.nombre,
        posX: datos.posX,
        posY: datos.posY,
        color: color
    };
});


props.socket.on("cursor:eliminar", (id) => {
    delete cursores.value[id];
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
                :style="{
                    left: cursor.posX + 'px',
                    top: cursor.posY + 'px',
                    color: cursor.color
                }">
                <span class="cursor-point"></span>
                {{ cursor.nombre }}
            </div>
        </div>

        <nav class="room-panel">
            <div class="room-heading">
                <span class="status-dot"></span>
                <span>SALA ACTIVA</span>
            </div>

            <h2>{{ nombreRoom }}</h2>

            <div class="room-info">
                <div class="info-item">
                    <span>Jugadores</span>
                    <strong>{{ countPlayer }} / {{ maxPlayers }}</strong>
                </div>

                <div class="player-bar">
                    <div class="player-progress"
                        :style="{ width: (maxPlayers ? countPlayer / maxPlayers * 100 : 0) + '%' }">
                    </div>
                </div>
            </div>

            <p class="room-tip">
                <span class="tip-icon">✎</span>
                Mantén pulsado para dibujar
            </p>

            <div class="room-buttons">
    <button @click="borrar()" class="btn-borrar">
        Esborrar
    </button>

    <button @click="desconectarUsuario()" class="btn-desconectar">
        Desconectar
    </button>
</div>
        </nav>

    </div>
</template>

<style scoped>
.canvas-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background: #f5f3ef;
}

canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: crosshair;
}

.cursor-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

.cursor {
    position: absolute;
    padding: 5px 9px;
    border-radius: 6px;
    background: #ffffff;
    border: 1px solid currentColor;
    box-shadow: 0 2px 6px #00000012;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    transform: translate(5px, 8px);
}

.cursor-point {
    display: inline-block;
    width: 7px;
    height: 7px;
    margin-right: 5px;
    border-radius: 50%;
    background: currentColor;
}

.room-panel {
    position: absolute;
    top: 20px;
    left: 20px;
    width: 230px;
    padding: 20px;
    box-sizing: border-box;
    background: #ffffff;
    border: 1px solid #e3e5e8;
    border-radius: 14px;
    box-shadow: 0 5px 20px #172b4d12;
    color: #172b4d;
    font-family: Arial, sans-serif;
}

.room-heading {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #667085;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #2eaf7d;
}

.room-panel h2 {
    margin: 12px 0 20px;
    font-size: 23px;
    overflow-wrap: anywhere;
}

.info-item {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    font-size: 12px;
}

.info-item span {
    color: #667085;
}

.info-item strong {
    color: #172b4d;
}

.player-bar {
    height: 6px;
    margin-top: 10px;
    overflow: hidden;
    border-radius: 10px;
    background: #e9edf0;
}

.player-progress {
    height: 100%;
    border-radius: 10px;
    background: #2eaf7d;
    transition: width 0.2s ease;
}

.room-tip {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 20px 0 0;
    padding-top: 14px;
    border-top: 1px solid #eef0f2;
    color: #667085;
    font-size: 11px;
}

.tip-icon {
    color: #2eaf7d;
    font-size: 17px;
}


.room-buttons {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 18px;
}

.btn-borrar,
.btn-desconectar {
    width: 100%;
    padding: 9px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s ease, border-color 0.2s ease;
}

.btn-borrar {
    color: #ffffff;
    background: #2eaf7d;
    border: 1px solid #2eaf7d;
}

.btn-borrar:hover {
    background: #258f66;
    border-color: #258f66;
}

.btn-desconectar {
    color: #c03939;
    background: #ffffff;
    border: 1px solid #e5bcbc;
}

.btn-desconectar:hover {
    background: #fff1f1;
    border-color: #c03939;
}

</style>