# 🎨 PaintRooms

### Un lienzo compartido, muchas ideas y una misma sala.

PaintRooms es una aplicación web colaborativa que permite a varios usuarios compartir un espacio de dibujo en tiempo real. Cada persona puede crear una sala o unirse a una existente para dibujar y ver cómo los demás participantes dan vida al mismo lienzo.

El proyecto nace con una idea sencilla: **dibujar juntos, desde distintos navegadores, y compartir la creatividad en tiempo real.**

---

## ✨ Funcionalidades

- 👤 **Identificación de usuarios:** cada participante puede elegir su nombre de usuario.
- 🏠 **Creación de salas:** permite crear una sala nueva para empezar a dibujar.
- 🚪 **Unirse a una sala:** los usuarios pueden entrar en una sala existente.
- 👥 **Gestión de participantes:** cada sala admite hasta 5 usuarios.
- 🖌️ **Dibujo colaborativo:** los trazos se comparten en tiempo real entre los usuarios de una misma sala.
- 🖱️ **Cursores en tiempo real:** permite ver el movimiento de los demás participantes en el lienzo.
- 💾 **Recuperación de los dibujos:** los nuevos participantes reciben los trazos que ya se han realizado en su sala.
- 🔄 **Recuperación de sesión:** el nombre del usuario y la sala se guardan en `localStorage` para facilitar la vuelta a la sala después de actualizar la página.
- ⚠️ **Gestión de errores:** se muestran avisos cuando se producen problemas al crear o acceder a una sala.

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|---|---|
| Vue 3 | Interfaz de usuario y componentes |
| Vite | Servidor de desarrollo del frontend |
| Node.js | Entorno de ejecución del backend |
| Express | Configuración del servidor |
| Socket.IO | Comunicación en tiempo real |
| HTML5 Canvas | Dibujo sobre el lienzo |
| Bootstrap | Diseño y estilos de la interfaz |
| SweetAlert2 | Alertas y mensajes de error |
| localStorage | Persistencia local de los datos de sesión |

## 📂 Estructura del proyecto

```text
PaintRooms/
├── back/
│   ├── server.js
│   └── package.json
│
└── front/
    └── PaintRooms/
        ├── src/
        │   ├── components/
        │   │   ├── Lobby.vue
        │   │   └── paint.vue
        │   └── App.vue
        ├── package.json
        └── ...
```

El backend gestiona las conexiones, los usuarios, las salas y la distribución de los dibujos. El frontend contiene la interfaz, el lobby y el lienzo colaborativo.

## 🚀 Cómo ejecutar el proyecto

### Requisitos previos

- Node.js y npm instalados.
- El repositorio clonado en tu equipo.

### 1. Clonar el repositorio

```bash
git clone https://github.com/a25juadiadua/PaintRooms.git
cd PaintRooms
```

### 2. Iniciar el backend

Abre una terminal y ejecuta:

```bash
cd back
npm install
npm run dev
```

El servidor se iniciará en el puerto `3000`.

### 3. Iniciar el frontend

Abre una segunda terminal desde la carpeta raíz del repositorio:

```bash
cd front/PaintRooms
npm install
npm run dev
```

Vite mostrará la dirección local del frontend, normalmente:

http://localhost:5173

Abre esa dirección en el navegador para empezar a utilizar PaintRooms.

> **Importante:** el backend y el frontend deben estar ejecutándose simultáneamente para que funcione la comunicación en tiempo real.

## 🔌 Comunicación en tiempo real

PaintRooms utiliza Socket.IO para mantener conectados a los participantes y transmitir los eventos de cada sala.

Entre las operaciones principales se encuentran:

- La creación de salas y la incorporación de usuarios.
- La actualización de la información de los participantes.
- El envío de las coordenadas del dibujo.
- La sincronización de los movimientos de los cursores.
- La recuperación de los trazos almacenados en la sala.

Cada sala mantiene sus propios usuarios y dibujos, de modo que la actividad de una sala no se transmite a las demás.

## 💾 Persistencia de los datos

El proyecto combina dos mecanismos de almacenamiento:

- **`localStorage`:** conserva localmente el nombre de usuario y el nombre de la sala para facilitar la recuperación de la sesión tras actualizar la página.
- **Memoria del servidor:** mantiene los datos de las salas y los dibujos mientras el proceso del backend sigue activo.

Los dibujos todavía no se guardan en una base de datos permanente. Si el servidor se reinicia, los datos que conserva en memoria se pierden.

## 🧭 Estado del proyecto

PaintRooms continúa en desarrollo. La base de la aplicación ya permite crear y compartir espacios de dibujo, intercambiar trazos en tiempo real y recuperar el contenido de una sala al incorporarse a ella.

Los siguientes pasos se centran en mejorar la gestión de las sesiones, controlar la salida voluntaria de las salas y terminar de pulir el comportamiento de la aplicación.

## 🎯 Objetivo

Este proyecto es una oportunidad para poner en práctica el desarrollo de aplicaciones web con Vue, la comunicación bidireccional mediante WebSockets y la gestión de usuarios y salas en un entorno colaborativo.

Más allá de dibujar, PaintRooms representa el proceso de aprender, probar, corregir y construir algo paso a paso.

---

**Hecho con código, paciencia y muchas ganas de seguir aprendiendo.** 💚


