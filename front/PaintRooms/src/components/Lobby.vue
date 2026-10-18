<script setup>
const props = defineProps(['socket']);
import {ref} from 'vue';

let username = ref("");
let roomname = ref("");
const pantalla = ref("nombre");
const opcionSala = ref(null);

function guardarNombre(){
    
    console.log ("Nombre: ", username.value );
    pantalla.value = "opciones";
}

function opcionUsuarioSala(){
    console.log ("Opcion Sala: ", opcionSala.value );
    pantalla.value = "sala";
}

function enviarDatos(nombre, opcionSalaUsuario,sala){
    console.log ("Datos Usuario: ", username.value, opcionSalaUsuario, sala );
    
    guardarNombreSala();

    props.socket.emit("nombre:opcion:sala", nombre, opcionSalaUsuario, sala);

}

function guardarNombreSala(){

    props.socket.on("nombre:ok", () => {
        localStorage.setItem("nombreUsuario", username.value);
        localStorage.setItem("nombreSala", roomname.value );
    });
}


</script>
<template>
    <div class="container-fluid min-vh-100 d-flex flex-column justify-content-center align-items-center py-5 px-3"
         style="background: linear-gradient(135deg, #e0f7ef 0%, #f4f9ff 50%, #fff4e0 100%);">

        <!-- Cabecera -->
        <div class="text-center mb-4">
            <div class="d-flex justify-content-center gap-2 mb-3">
                <span class="d-inline-block rounded-circle bg-danger shadow-sm" style="width: 16px; height: 16px;"></span>
                <span class="d-inline-block rounded-circle bg-warning shadow-sm" style="width: 16px; height: 16px;"></span>
                <span class="d-inline-block rounded-circle bg-success shadow-sm" style="width: 16px; height: 16px;"></span>
                <span class="d-inline-block rounded-circle bg-primary shadow-sm" style="width: 16px; height: 16px;"></span>
            </div>
            <h1 class="display-4 fw-bold text-success mb-0">PaintRooms</h1>
        </div>

        <!-- Pantalla 1: nombre -->
        <div id="divNombre" v-if="pantalla === 'nombre'" class="card border-0 shadow-lg rounded-4 mx-auto w-100" style="max-width: 450px;">

            <div class="card-body p-4 p-md-5">

                <form @submit.prevent="guardarNombre(username)" >
            
                    <label for="nom" class="form-label fw-semibold text-secondary">Nom d'Usuari:</label>
                    <input type="text" name="nom" id="inputNom" class="form-control form-control-lg bg-light border-0 mb-4" v-model="username">

                    <button class="btn btn-success btn-lg w-100 rounded-pill shadow-sm fw-semibold">Entrar</button>
                </form>

            </div>

        </div>
        
        <!-- Pantalla 2: opciones -->
        <div id="escogerOCrearSala" v-if="pantalla === 'opciones'" class="card border-0 shadow-lg rounded-4 mx-auto w-100" style="max-width: 450px;">

            <div class="card-body p-4 p-md-5">

                <h2 class="h3 fw-bold text-center text-dark mb-4">Que opción quieres?</h2>

                <div class="d-grid gap-3">
                    <button class="btn btn-outline-success btn-lg rounded-pill py-3 fw-semibold" @click="opcionSala = true, opcionUsuarioSala()">Unirme a una sala</button>
                
                    <button class="btn btn-success btn-lg rounded-pill py-3 shadow-sm fw-semibold" @click="opcionSala = false, opcionUsuarioSala()">Crear una sala</button>
                </div>

            </div>
            
        </div>

        <!-- Pantalla 3: datos de la sala -->
        <div id="divDatosSala" v-if="pantalla === 'sala'" class="card border-0 shadow-lg rounded-4 mx-auto w-100" style="max-width: 450px;">

            <div class="card-body p-4 p-md-5">

                <form @submit.prevent="enviarDatos(username, opcionSala, roomname)">
                
                    <label for="sala" class="form-label fw-semibold text-secondary">Nom de la sala:</label>
                    <input type="text" name="sala" id="inputSala" class="form-control form-control-lg bg-light border-0 mb-4" v-model="roomname">

                    <button class="btn btn-success btn-lg w-100 rounded-pill shadow-sm fw-semibold" v-if="opcionSala === true ">Entrar a la sala</button>
                    <button class="btn btn-success btn-lg w-100 rounded-pill shadow-sm fw-semibold" v-if="opcionSala === false ">Crear la sala</button>
                </form>

            </div>

        </div>

    </div>
    
</template>