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
const colorUsuario = ref("#000000");
const grosorPincel = ref(3);
const panelVisible = ref(true);
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


// Funcion Canva Pantalla
function ajustarCanvas() {
    props.socket.emit("dibujo:solicitar");


    canvas.value.width = window.innerWidth;
    canvas.value.height = window.innerHeight;

    
}


// FUNCIONES SOCKETS ENVIO DE DATOS
function empezarDibujo(event){
    estaDibujando = true;
    
    ctx.beginPath();
    ctx.lineWidth = grosorPincel.value;
    ctx.strokeStyle = colorUsuario.value;
    ctx.moveTo(event.offsetX, event.offsetY);

    props.socket.emit('dibujo:inicio', {
    x: event.offsetX,
    y: event.offsetY,
    color: colorUsuario.value,
    grosor: grosorPincel.value 
});
}

function moverDibujo(event){

    if(estaDibujando){
        ctx.lineWidth = grosorPincel.value;
        ctx.strokeStyle = colorUsuario.value;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();

        
 
        props.socket.emit('dibujo:mover', {
    x: event.offsetX,
    y: event.offsetY,
    color: colorUsuario.value,
    grosor: grosorPincel.value
});
    }
    
    posX.value = event.offsetX;
    posY.value = event.offsetY;
}

function terminarDibujo(){
    estaDibujando = false;
}


// DESCONECTAR USUARIO
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

// BORRAR
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

    //DATOS DE LA SALA
    props.socket.on("datos:sala",(datos) => {
        
        
        datos.forEach((element) => {
            
            if(element.Inicio === true){
                ctx.beginPath();
                ctx.lineWidth = element.grosor;
                ctx.strokeStyle = element.color;
                ctx.moveTo(element.X, element.Y);
                
            }else{
                ctx.lineWidth = element.grosor;
                ctx.strokeStyle = element.color;
                ctx.lineTo(element.X, element.Y);
                ctx.stroke();
            }
        });
        
    });
    

    //INICIO DE DIBUJO
    props.socket.on('dibujo:inicio', (datos) => {
        ctx.beginPath();
        ctx.moveTo(datos.x, datos.y);
        ctx.strokeStyle = datos.color;
        ctx.lineWidth = datos.grosor;
    });

    //CUANDO SE MUEVE EL RATON
    props.socket.on('dibujo:mover', (datos) => {
        console.log("Datos recibidos en Vue:", datos);
        ctx.lineWidth = datos.grosor;
        ctx.strokeStyle = datos.color;
        ctx.lineTo(datos.x, datos.y);
        ctx.stroke();
    });

    //CUANDO EL USUARIO QUIERE BORRAR SU PARTE
    props.socket.on("dibujo:borrar", (datos) => {


        ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);

        
        datos.forEach((element) => {
            
            if(element.Inicio === true){
                ctx.beginPath();
                ctx.lineWidth = element.grosor
                ctx.strokeStyle = element.color;
                ctx.moveTo(element.X, element.Y);

            }else{
                ctx.lineWidth = element.grosor
                ctx.strokeStyle = element.color;
                ctx.lineTo(element.X, element.Y);
                ctx.stroke();
            }
        });

    

    });


    //INFORMACION DE LA SALA
    props.socket.on("info:sala",( nombreSala, jugadoresSala, maxJuagdor, usarios) => {
        nombreRoom.value = nombreSala;
        maxPlayers.value = maxJuagdor;
        users.value = usarios;
        countPlayer.value = jugadoresSala;
    });

    //MOVER EL CURSOR CON EL NOMBRE
   props.socket.on("cursor:mover", (datos) => {
    let color;
    console.log("Grosor recibido:", datos.grosor);
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

        <!-- Botón para mostrar y ocultar el panel -->
        <button class="btn-panel"
            @click="panelVisible = !panelVisible">
            {{ panelVisible ? '✕' : '☰' }}
        </button>

        <nav class="room-panel" v-if="panelVisible">

            <div class="room-heading">
                <span class="status-dot"></span>
                <span>SALA ACTIVA</span>
            </div>

            <h2>{{ nombreRoom }}</h2>

            <div class="room-info">
                <div class="info-item">
                    <span>Jugadores conectados</span>
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

            <div class="panel-divider"></div>

            <section class="drawing-controls">
                <h3>Herramientas</h3>

                <div class="color-selector">
                    <label for="color">Color del pincel</label>

                    <div class="color-input">
                        <input type="color"
                            name="color"
                            id="color"
                            v-model="colorUsuario">

                        <span>{{ colorUsuario }}</span>
                    </div>
                </div>

                <div class="thickness-selector">
                    <div class="thickness-heading">
                        <label for="grosor">Grosor del pincel</label>
                        <span class="thickness-value">{{ grosorPincel }} px</span>
                    </div>

                    <input type="range"
                        name="grosor"
                        id="grosor"
                        v-model="grosorPincel"
                        min="1"
                        max="20">
                </div>
            </section>

            <div class="room-buttons">
                <button @click="borrar()" class="btn-borrar">
                    <span>⌫</span>
                    Borrar dibujo
                </button>

                <button @click="desconectarUsuario()" class="btn-desconectar">
                    <span>↪</span>
                    Desconectar
                </button>
            </div>

            <div class="panel-footer">
                PaintRooms <span>·</span> Espacio colaborativo
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


.color-selector {
    margin-top: 18px;
}

.color-selector label {
    display: block;
    margin-bottom: 8px;
    color: #667085;
    font-size: 12px;
    font-weight: 600;
}

.color-input {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 10px;
    border: 1px solid #e3e5e8;
    border-radius: 8px;
    background: #ffffff;
}

.color-input input[type="color"] {
    width: 32px;
    height: 32px;
    padding: 2px;
    border: 1px solid #e3e5e8;
    border-radius: 6px;
    background: #ffffff;
    cursor: pointer;
}

.color-input span {
    color: #172b4d;
    font-family: monospace;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
}


.panel-divider {
    height: 1px;
    margin: 18px 0;
    background: #eef0f2;
}

.drawing-controls h3 {
    margin: 0 0 14px;
    font-size: 15px;
    font-weight: 700;
    color: #172b4d;
}

.color-input {
    min-width: 0;
}

.color-input span {
    overflow: hidden;
    text-overflow: ellipsis;
}

.thickness-selector {
    margin-top: 18px;
}

.thickness-heading {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 10px;
}

.thickness-heading label {
    color: #667085;
    font-size: 12px;
    font-weight: 600;
}

.thickness-value {
    padding: 4px 7px;
    border-radius: 6px;
    background: #eaf7f1;
    color: #258f66;
    font-family: monospace;
    font-size: 12px;
    font-weight: 700;
}

.thickness-selector input[type="range"] {
    width: 100%;
    accent-color: #2eaf7d;
    cursor: pointer;
}

.room-buttons button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.room-buttons button span {
    font-size: 16px;
}

.panel-footer {
    margin-top: 16px;
    padding-top: 12px;
    border-top: 1px solid #eef0f2;
    color: #98a2b3;
    font-size: 10px;
    text-align: center;
}

.panel-footer span {
    padding: 0 3px;
    color: #2eaf7d;
}

.btn-panel {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 10;
    width: 42px;
    height: 42px;
    border: 1px solid #e3e5e8;
    border-radius: 10px;
    background: #ffffff;
    color: #172b4d;
    font-size: 20px;
    cursor: pointer;
    box-shadow: 0 3px 12px #172b4d15;
}

.btn-panel:hover {
    background: #eaf7f1;
    color: #258f66;
}

</style>