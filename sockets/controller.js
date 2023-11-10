const Sesiones = require("../models/sesiones");

let sesionesID = 1;

const socketController = (socket, sesiones = new Sesiones()) => {
  //socket.on('event', data => { /* … */ });

  console.log("cliente conectado");

  socket.on("disconnect", () => {
    console.log("cliente desconectado");
    sesiones.removerSesionesBySocketId(socket.id)
    socket.broadcast.emit("allSesiones", sesiones.getSesiones());
  });
  socket.on("salon", (payload) => {
    sesiones.addSesion({
      socketId: socket.id,
      salon: payload.name,
      password: payload.password,
      jugadores: payload.jugadores,
      jugando: 0,
      id: sesionesID++,
    });
    socket.emit("allSesiones", sesiones.getSesiones());
    socket.broadcast.emit("allSesiones", sesiones.getSesiones());
  });

  socket.on("getSesiones", () => {
    socket.emit("allSesiones", sesiones.getSesiones());
  });

  socket.on("enviar-mensaje", (payload, callback) => {
    socket.broadcast.emit("enviar-mensaje", payload);
    const id = 123456;
    callback(id);
  });

  socket.on("game", (p, id) => {
    console.log(p, sesiones);
  });
};

module.exports = {
  socketController,
};
