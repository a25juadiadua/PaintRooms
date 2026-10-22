# PaintRooms 🎨

PaintRooms es una aplicación web de dibujo colaborativo en tiempo real. Permite que varios usuarios se conecten a una misma sala, compartan un lienzo y vean los dibujos y movimientos de los cursores de los demás usuarios.

El proyecto está desarrollado con Vue 3 en el frontend y Node.js, Express y Socket.IO en el backend.

## ✨ Funcionalidades

- **Gestión de salas:** crear una sala nueva o entrar en una sala existente mediante su nombre.
- **Usuarios:** elegir un nombre de usuario para participar en la sala.
- **Dibujo colaborativo:** dibujar en un lienzo compartido y visualizar los trazos de otros usuarios en tiempo real.
- **Personalización del pincel:** seleccionar el color y ajustar el grosor del trazo.
- **Cursores en tiempo real:** visualizar la posición y el nombre de los demás participantes.
- **Información de la sala:** consultar el nombre de la sala, los jugadores conectados y la capacidad máxima.
- **Borrar el dibujo:** limpiar el lienzo compartido.
- **Desconexión:** salir de la sala mediante una confirmación.
- **Recuperación de sesión:** guardar el nombre de usuario y la sala en `localStorage` para recuperar los datos al actualizar la página.
- **Interfaz visual:** panel de herramientas con los controles de dibujo y la información de la sala.

## 🛠️ Tecnologías utilizadas

### Frontend
- Vue 3
- Vite
- JavaScript
- HTML5 Canvas
- CSS
- Socket.IO Client
- SweetAlert2

### Backend
- Node.js
- Express
- Socket.IO

## 📁 Estructura del proyecto

```text
PaintRooms/
├── back/
│   ├── package.json
│   └── server.js
│
└── front/
    └── PaintRooms/
        ├── package.json
        ├── index.html
        ├── src/
        │   ├── App.vue
        │   ├── components/
        │   │   ├── Lobby.vue
        │   │   └── paint.vue
        │   └── ...
        └── ...
```

La estructura de los archivos puede variar según los componentes y carpetas añadidos durante el desarrollo.

## 🚀 Instalación y ejecución

### Requisitos previos

- Node.js
- npm

### 1. Descargar el proyecto

Clona el repositorio y accede a la carpeta principal:

```bash
git clone https://github.com/a25juadiadua/PaintRooms
cd PaintRooms
```

### 2. Iniciar el backend

Abre una terminal y ejecuta:

```bash
cd back
npm install
npm run dev
```

El servidor Socket.IO utiliza el puerto `3000`.

### 3. Iniciar el frontend

Abre una segunda terminal y ejecuta:

```bash
cd front/PaintRooms
npm install
npm run dev
```

Vite iniciará el servidor de desarrollo, normalmente en:

```text
http://localhost:5173
```

Abre esa dirección en el navegador. Para comprobar el dibujo colaborativo, puedes abrir la aplicación en dos pestañas o ventanas y entrar en la misma sala con usuarios distintos.

## 🔄 Comunicación en tiempo real

La comunicación entre el frontend y el backend se realiza mediante eventos de Socket.IO.

Entre los eventos utilizados se encuentran:

| Evento | Función |
|---|---|
| `nombre:opcion:sala` | Enviar los datos para crear o entrar en una sala. |
| `nombre:ok` | Confirmar el acceso del usuario. |
| `error:sala` | Comunicar un error relacionado con la sala. |
| `error:usuario` | Comunicar un error relacionado con el usuario. |
| `dibujo:inicio` | Indicar el inicio de un trazo. |
| `dibujo:mover` | Enviar los puntos del dibujo. |
| `dibujo:solicitar` | Solicitar los dibujos guardados de la sala. |
| `datos:sala` | Recibir los datos de los dibujos de la sala. |
| `dibujo:borrar` | Gestionar el borrado y la actualización del lienzo. |
| `cursor:mover` | Actualizar la posición de un cursor. |
| `cursor:eliminar` | Eliminar el cursor de un usuario desconectado. |
| `info:sala` | Recibir información sobre la sala y sus participantes. |

Los eventos permiten que el servidor gestione la comunicación entre los usuarios de una misma sala.

## 🖌️ Funcionamiento del dibujo

El lienzo se implementa mediante HTML5 Canvas.

Cuando un usuario empieza a dibujar, se registra el punto inicial, el color y el grosor del pincel. Durante el movimiento del ratón, se envían las coordenadas al servidor, que distribuye los datos a los usuarios de la sala.

Los trazos se almacenan en el servidor para poder reconstruir el dibujo cuando un usuario solicita los datos de la sala.

## 📌 Estado del proyecto

El proyecto se encuentra en desarrollo. Las funcionalidades implementadas incluyen la gestión de salas, el dibujo compartido, los cursores, la personalización del pincel y los controles principales de la interfaz.

Entre las posibles mejoras se encuentran:

- Optimizar el envío de puntos del dibujo para reducir el número de mensajes.
- Mejorar la limpieza de eventos y temporizadores al salir del componente.
- Revisar el comportamiento del lienzo al cambiar el tamaño de la ventana.
- Mejorar la experiencia de uso en dispositivos táctiles.
- Seguir mejorando la interfaz y los controles del panel de herramientas.

## 👨‍💻 Autor

Proyecto desarrollado como práctica de desarrollo de aplicaciones web con Vue 3, Node.js y Socket.IO.
