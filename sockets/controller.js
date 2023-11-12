const { Sesiones } = require("../models/sesiones");

/*
    [x] Un socketId crear una Mesa
    [x] El administrador y los jugadores tienen que tener un nombre
    [x] La mesa es un codigo con el ID
    [x] Los jugadores se unen a ese codigo
    [-] El administrador va a aceptar a los jugadores   
    [x] Si el creador de la mesa sale, se borra la mesa    
    [x] Crea la mesa, entra a jugar y es el administrador
    [x] Se puede esperar a que se llene la mesa o se puede empezar a jugar con los que estan. Minimo 2
    [x] Otros usuarios podrian estar en espera, para jugar la proxima partida
    [x] El administrador empieza o reinicia el partido
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
    if (sesiones.existeSesionBySocketId(socket.id) == -1) {
      const dato = {
        id: sesionesID++,
        socketId: socket.id,
        nombre: payload.nombre,
      };
      sesiones.addSesion(dato);
    }
    socket.emit("addMesa", socket.id);
  });

  socket.on("joinMesa", (payload) => {
    if (sesiones.addPlayerToSession(payload.nombre, payload.code, socket.id)) {
      socket.emit("joinMesa", socket.id);
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
    if (socket.id != payload.playerSocket) {
      const ix = sesiones.existeSesionBySocketId(socket.id);
      if (ix != -1) {
        if (sesiones.removePlayer(socket.id, payload.playerSocket)) {
          updateMesa(socket.id);
          socket.to(payload.playerSocket).emit("disconnected");
        }
      }
    }
  });

  /*const sendGameStatus = (socket, evento, payload) => {
    socket.to(socket).emit(evento, payload);
  };*/

  socket.on("startGame", (payload) => {
    const ix = sesiones.crearNewGameToSession(socket.id);
    if (ix != -1) {
      let participantes = [];
      sesiones.sesiones[ix].game.players.jugadores.forEach((j) => {
        const dato = {
          nombre: j.nombre,
          cartas: j.cartas.length,
          saidUno: j.saidUno,
        };
        participantes.push(dato);
      });

      sesiones.sesiones[ix].game.players.jugadores.forEach((p) => {
        const pay = {
          socketId: p.id,
          cartas: p.cartas,
          saidUno: p.saidUno,
          nombre: p.nombre,
          turno: sesiones.sesiones[ix].game.elJuego.turno,
          descarte: sesiones.sesiones[ix].game.descarte,
          players: participantes,
          ganadores: sesiones.sesiones[ix].game.ganadores,
        };
        if (p.id != socket.id) {
          socket.to(p.id).emit("gameStatus", pay);
        } else {
          socket.emit("gameStatus", pay);
        }
      });
    }
  });
  socket.on("playCard", (payload) => {
    //chequear que sea la misma carta por las dudas
    const ix = sesiones.SesionIdByCode(payload.code);
    if (ix != -1) {
      const { processed, player } = sesiones.sesiones[
        ix
      ].game.players.getPlayerByIdentification(socket.id);
      if (processed) {
       
          sesiones.sesiones[ix].game.arbitrarJugada(
            sesiones.sesiones[ix].game.descartarCarta(
              player,
              player.cartas[payload.cart_index],
              payload.color
            )
          )


        let participantes = [];
        sesiones.sesiones[ix].game.players.jugadores.forEach((j) => {
          const dato = {
            nombre: j.nombre,
            cartas: j.cartas.length,
            saidUno: j.saidUno,
          };
          participantes.push(dato);
        });

        sesiones.sesiones[ix].game.players.jugadores.forEach((p) => {
          const pay = {
            socketId: p.id,
            cartas: p.cartas,
            saidUno: p.saidUno,
            nombre: p.nombre,
            turno: sesiones.sesiones[ix].game.elJuego.turno,
            descarte: sesiones.sesiones[ix].game.descarte,
            players: participantes,
            ganadores: sesiones.sesiones[ix].game.ganadores,
          };
          if (p.id != socket.id) {
            socket.to(p.id).emit("gameStatus", pay);
          } else {
            socket.emit("gameStatus", pay);
          }
        });
      }
    }
  });

  socket.on("playPick", (payload) => {
    //chequear que sea la misma carta por las dudas
    const ix = sesiones.SesionIdByCode(payload.code);
    if (ix != -1) {
      const { processed, player } = sesiones.sesiones[
        ix
      ].game.players.getPlayerByIdentification(socket.id);
      if (processed) {

          sesiones.sesiones[ix].game.arbitrarJugada(
            sesiones.sesiones[ix].game.levantarCartaDePila(
              player
            )
          )

        let participantes = [];
        sesiones.sesiones[ix].game.players.jugadores.forEach((j) => {
          const dato = {
            nombre: j.nombre,
            cartas: j.cartas.length,
            saidUno: j.saidUno,
          };
          participantes.push(dato);
        });

        sesiones.sesiones[ix].game.players.jugadores.forEach((p) => {
          const pay = {
            socketId: p.id,
            cartas: p.cartas,
            saidUno: p.saidUno,
            nombre: p.nombre,
            turno: sesiones.sesiones[ix].game.elJuego.turno,
            descarte: sesiones.sesiones[ix].game.descarte,
            players: participantes,
            ganadores: sesiones.sesiones[ix].game.ganadores,
          };
          if (p.id != socket.id) {
            socket.to(p.id).emit("gameStatus", pay);
          } else {
            socket.emit("gameStatus", pay);
          }
        });
      }
    }
  });

  socket.on("playPass", (payload) => {
    //chequear que sea la misma carta por las dudas
    const ix = sesiones.SesionIdByCode(payload.code);
    if (ix != -1) {
      const { processed, player } = sesiones.sesiones[
        ix
      ].game.players.getPlayerByIdentification(socket.id);
      if (processed) {

          sesiones.sesiones[ix].game.arbitrarJugada(
            sesiones.sesiones[ix].game.pasarTurnoSinJugar(
              player
            )
          )

        let participantes = [];
        sesiones.sesiones[ix].game.players.jugadores.forEach((j) => {
          const dato = {
            nombre: j.nombre,
            cartas: j.cartas.length,
            saidUno: j.saidUno,
          };
          participantes.push(dato);
        });

        sesiones.sesiones[ix].game.players.jugadores.forEach((p) => {
          const pay = {
            socketId: p.id,
            cartas: p.cartas,
            saidUno: p.saidUno,
            nombre: p.nombre,
            turno: sesiones.sesiones[ix].game.elJuego.turno,
            descarte: sesiones.sesiones[ix].game.descarte,
            players: participantes,
            ganadores: sesiones.sesiones[ix].game.ganadores,
          };
          if (p.id != socket.id) {
            socket.to(p.id).emit("gameStatus", pay);
          } else {
            socket.emit("gameStatus", pay);
          }
        });
      }
    }
  });

  socket.on("playUNO", (payload) => {
    //chequear que sea la misma carta por las dudas
    const ix = sesiones.SesionIdByCode(payload.code);
    if (ix != -1) {
      const { processed, player } = sesiones.sesiones[
        ix
      ].game.players.getPlayerByIdentification(socket.id);
      if (processed) {

          sesiones.sesiones[ix].game.arbitrarJugada(
            sesiones.sesiones[ix].game.decirUNO(
              player
            )
          )

        let participantes = [];
        sesiones.sesiones[ix].game.players.jugadores.forEach((j) => {
          const dato = {
            nombre: j.nombre,
            cartas: j.cartas.length,
            saidUno: j.saidUno,
          };
          participantes.push(dato);
        });

        sesiones.sesiones[ix].game.players.jugadores.forEach((p) => {
          const pay = {
            socketId: p.id,
            cartas: p.cartas,
            saidUno: p.saidUno,
            nombre: p.nombre,
            turno: sesiones.sesiones[ix].game.elJuego.turno,
            descarte: sesiones.sesiones[ix].game.descarte,
            players: participantes,
            ganadores: sesiones.sesiones[ix].game.ganadores,
          };
          if (p.id != socket.id) {
            socket.to(p.id).emit("gameStatus", pay);
          } else {
            socket.emit("gameStatus", pay);
          }
        });
      }
    }
  });
  

};

module.exports = {
  socketController,
};
