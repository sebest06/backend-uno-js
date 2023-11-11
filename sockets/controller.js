const { Sesiones } = require("../models/sesiones");

/*
    [x] Un socketId crear una Mesa
    [x] El administrador y los jugadores tienen que tener un nombre
    [x] La mesa es un codigo con el ID
    [x] Los jugadores se unen a ese codigo
    [ ] El administrador va a aceptar a los jugadores   
    [x] Si el creador de la mesa sale, se borra la mesa    
    [x] Crea la mesa, entra a jugar y es el administrador
    [ ] Se puede esperar a que se llene la mesa o se puede empezar a jugar con los que estan. Minimo 2
    [ ] Otros usuarios podrian estar en espera, para jugar la proxima partida
    [ ] El administrador empieza o reinicia el partido
    [ ] El administrador puede pasar un turno
    [x] El administrador puede echar a un jugador
*/
let sesionesID = 1;

const socketController = (socket, sesiones = new Sesiones()) => {
  socket.on("disconnect", () => {
    const MesaSockeId = sesiones.removerSesionesBySocketId(socket.id);
    updateMesaAdmin(MesaSockeId);
  });

  socket.on("addMesa", (payload) => {
    if (sesiones.existeSesionBySocketId(payload.socketId) == -1) {
      const dato = {
        id: sesionesID++,
        socketId: payload.socketId,
        nombre: payload.nombre,
      };
      sesiones.addSesion(dato);
    }
    socket.emit("addMesa", payload.socketId);
  });

  socket.on("joinMesa", (payload) => {
    if (
      sesiones.addPlayerToSession(
        payload.nombre,
        payload.code,
        payload.socketId
      )
    ) {
      socket.emit("joinMesa", payload.socketId);
      const MesaSockeId = sesiones.getMesaSocketId(payload.code);
      updateMesaAdmin(MesaSockeId);
    }
  });

  socket.on("getMesa", (payload) => {
    updateMesa(payload.socketId);
  });

  const updateMesa = (MesaSockeId) => {
    const ix = sesiones.existeSesionBySocketId(MesaSockeId);
    if (ix >= 0) {
      socket.emit("getMesa", {
        socketId: MesaSockeId,
        players: sesiones.sesiones[ix].players,
      });
    }
  };

  const updateMesaAdmin = (AdminSocket) => {
    const ix = sesiones.existeSesionBySocketId(AdminSocket);
    if (ix >= 0) {
      socket.to(AdminSocket).emit("getMesa", {
        socketId: AdminSocket,
        players: sesiones.sesiones[ix].players,
      });
    }
  };

  socket.on("kickPlayer", (payload) => {
    if (payload.socketId != payload.playerSocket) {
      const ix = sesiones.existeSesionBySocketId(payload.socketId);
      if (ix != -1) {
        if (sesiones.removePlayer(payload.socketId, payload.playerSocket)) {
          updateMesa(payload.socketId);
          socket.to(payload.playerSocket).emit("disconnected");
        }
      }
    }
  });

/*  socket.on("salon", (payload) => {
    sesiones.addSesion({
            id: sesionesID++,
            socketId: socket.id,
            salon: payload.name,
            password: payload.password,
            jugadores: payload.jugadores,
            jugando: 0,
        });
        socket.emit("allSesiones", sesiones.getSesiones());
        socket.broadcast.emit("allSesiones", sesiones.getSesiones());
  });

  socket.on("getSesiones", () => {
    //socket.emit("allSesiones", sesiones.getSesiones());
  });

  socket.on("unirse", (payload) => {
    /*if (sesiones.setJugador(payload.gameId, payload.jugador, payload.password)) {
            socket.emit("unido", { msg: "ok", gameId: payload.gameId, jugador: payload.jugador, password: payload.password})

            socket.emit("allSesiones", sesiones.getSesiones());
            socket.broadcast.emit("allSesiones", sesiones.getSesiones());

            console.log(sesiones.getSesiones())
        }
  });

  socket.on("enviar-mensaje", (payload, callback) => {
      socket.broadcast.emit("enviar-mensaje", payload);
      const id = 123456;
      callback(id);
    })
    */
    
};

module.exports = {
  socketController,
};
