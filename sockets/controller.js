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
    [x] Cuando se desconecte un jugador que este jugando, deberia quitarle las cartas, borrarlo de los jugadores y mezclar en la baraja sus cartas
*/
let sesionesID = 1;

const socketController = (socket, sesiones = new Sesiones()) => {
    socket.on("disconnect", () => {
        // Si este socket es dueño de una sala, notifica a los jugadores antes de eliminarla
        const adminIx = sesiones.existeSesionBySocketId(socket.id);
        if (adminIx >= 0) {
            sesiones.sesiones[adminIx].players
                .filter(p => p.id !== socket.id)
                .forEach(p => socket.to(p.id).emit("disconnected"));
        }

        const MesaSockeId = sesiones.removerSesionesBySocketId(socket.id);
        updateMesaAdmin(MesaSockeId);
        if (MesaSockeId != -1) {
            updateMesaByIx(sesiones.getSesionFromSocketId(MesaSockeId))
        }
    });

    socket.on("addMesa", (payload) => {
        try {
            if (sesiones.existeSesionBySocketId(socket.id) == -1) {
                const dato = {
                    id: sesionesID++,
                    socketId: socket.id,
                    nombre: payload.nombre,
                };
                sesiones.addSesion(dato);
            }
            socket.emit("addMesa", socket.id);
        }
        catch {
            return
        }
    });

    socket.on("joinMesa", (payload) => {
        try {
            if (
                payload.nombre !== undefined &&
                payload.code !== undefined &&
                typeof payload.nombre === "string" &&
                payload.nombre.trim().length > 0 &&
                payload.nombre.trim().length <= 20
            ) {
                if (sesiones.addPlayerToSession(payload.nombre.trim(), payload.code, socket.id)) {
                    socket.emit("joinMesa", socket.id);
                    const MesaSockeId = sesiones.getMesaSocketId(payload.code);
                    updateMesaAdmin(MesaSockeId);
                }
            }
        } catch {
            return;
        }


    });

    socket.on("getMesa", (payload) => {
        try {
            updateMesa(payload.socketId);
        } catch {
            return
        }
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

    const updateMesaByIx = (ix) => {
        //const ix = sesiones.SesionIdByCode(payload.code);
        let participantes = [];
        if (!sesiones.sesiones[ix].game && sesiones.sesiones[ix].game == null) {
            console.log("No habia juego?")
            return;
        }
        sesiones.sesiones[ix].game.players.jugadores.forEach((j) => {
            const dato = {
                nombre: j.nombre,
                cartas: j.cartas.length,
                saidUno: j.saidUno,
                strikes: j.strikes,
            };
            participantes.push(dato);
        });

        sesiones.sesiones[ix].game.players.jugadores.forEach((p, p_index) => {
            const pay = {
                socketId: p.id,
                cartas: p.cartas,
                comodin: sesiones.sesiones[ix].game.elJuego.color,
                saidUno: p.saidUno,
                nombre: p.nombre,
                jugando: !sesiones.sesiones[ix].game.elJuego.finalizo,
                miturno: p_index == (sesiones.sesiones[ix].game.elJuego.ronda % sesiones.sesiones[ix].game.players.jugadores.length) ? true : false,
                turno: {
                    nombre: sesiones.sesiones[ix].game.elJuego.turno,
                    turno:
                        sesiones.sesiones[ix].game.elJuego.ronda %
                        sesiones.sesiones[ix].game.players.jugadores.length,
                },
                descarte: sesiones.sesiones[ix].game.descarte,
                crowns: p.crowns,
                players: participantes,
                ganadores: sesiones.sesiones[ix].game.ganadores,
            };
            if (p.id != socket.id) {
                socket.to(p.id).emit("gameStatus", pay);
            } else {
                socket.emit("gameStatus", pay);
            }
        });

        sesiones.sesiones[ix].game.ganadores.forEach((p, p_index) => {
            const pay = {
                socketId: p.id,
                cartas: [],
                comodin: "",
                saidUno: true,
                nombre: p.nombre,
                jugando: false,
                miturno: false,
                turno: {
                    nombre: sesiones.sesiones[ix].game.elJuego.turno,
                    turno:
                        sesiones.sesiones[ix].game.elJuego.ronda %
                        sesiones.sesiones[ix].game.players.jugadores.length,
                },
                descarte: sesiones.sesiones[ix].game.descarte,
                crowns: p.crowns,
                players: participantes,
                ganadores: sesiones.sesiones[ix].game.ganadores,
            };
            if (p.id != socket.id) {
                socket.to(p.id).emit("gameStatus", pay);
            } else {
                socket.emit("gameStatus", pay);
            }
        });

        sesiones.sesiones[ix].game.perdedores.forEach((p, p_index) => {
            const pay = {
                socketId: p.id,
                cartas: [],
                comodin: "",
                saidUno: true,
                nombre: p.nombre,
                jugando: false,
                miturno: false,
                turno: {
                    nombre: sesiones.sesiones[ix].game.elJuego.turno,
                    turno:
                        sesiones.sesiones[ix].game.elJuego.ronda %
                        sesiones.sesiones[ix].game.players.jugadores.length,
                },
                descarte: sesiones.sesiones[ix].game.descarte,
                crowns: p.crowns,
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

    socket.on("kickPlayer", (payload) => {
        try {
            if (socket.id != payload.playerSocket) {
                const ix = sesiones.existeSesionBySocketId(socket.id);
                if (ix != -1) {
                    if (sesiones.removePlayer(socket.id, payload.playerSocket) != -1) {
                        updateMesa(socket.id);
                        socket.to(payload.playerSocket).emit("disconnected");
                        //console.log("se pateo a un jugador de la mesa")
                        updateMesaByIx(ix)
                    }
                }
            }
        } catch {
            return
        }
    });

    socket.on("startGame", (payload) => {
        try {
            let strikes = (payload && payload.hasOwnProperty('strikes')) ? payload.strikes : 3;
            strikes = parseInt(strikes, 10);
            if (isNaN(strikes) || strikes < 0) strikes = 3;
            const ix = sesiones.crearNewGameToSession(socket.id, strikes);
            if (ix != -1) {
                //console.log("Se inicio un juego nuevo")
                updateMesaByIx(ix)
            }
        } catch {
            return
        }
    });
    socket.on("playCard", (payload) => {
        try {
            const ix = sesiones.SesionIdByCode(payload.code);
            if (ix != -1) {
                const { processed, player } = sesiones.sesiones[
                    ix
                ].game.players.getPlayerByIdentification(socket.id);
                if (processed) {
                    const cart_index = parseInt(payload.cart_index, 10);
                    if (isNaN(cart_index) || cart_index < 0 || cart_index >= player.cartas.length) return;
                    const resultado = sesiones.sesiones[ix].game.arbitrarJugada(
                        sesiones.sesiones[ix].game.descartarCarta(
                            player,
                            player.cartas[cart_index],
                            payload.color
                        )
                    );
                    if (resultado && !resultado.penalizado && payload.sayUno) {
                        sesiones.sesiones[ix].game.arbitrarJugada(
                            sesiones.sesiones[ix].game.decirUNO(player)
                        );
                    }
                    updateMesaByIx(ix)
                    let sesionplayer_ix = sesiones.sesiones[ix].players.findIndex(p => {
                      return p.id === player.id
                    })
                    if(player.won == true){
                        sesiones.sesiones[ix].players[sesionplayer_ix].crowns += 1
                    }
                }
            }
        } catch {
            return
        }
    });

    socket.on("playPick", (payload) => {
        try {
            const ix = sesiones.SesionIdByCode(payload.code);
            if (ix != -1) {
                const { processed, player } = sesiones.sesiones[
                    ix
                ].game.players.getPlayerByIdentification(socket.id);
                if (processed) {
                    sesiones.sesiones[ix].game.arbitrarJugada(
                        sesiones.sesiones[ix].game.levantarCartaDePila(player)
                    );
                    updateMesaByIx(ix)
                }
            }
        } catch {
            return
        }
    });

    socket.on("playPass", (payload) => {
        try {
            const ix = sesiones.SesionIdByCode(payload.code);
            if (ix != -1) {
                const { processed, player } = sesiones.sesiones[
                    ix
                ].game.players.getPlayerByIdentification(socket.id);
                if (processed) {
                    sesiones.sesiones[ix].game.arbitrarJugada(
                        sesiones.sesiones[ix].game.pasarTurnoSinJugar(player)
                    );
                    updateMesaByIx(ix)
                }
            }
        } catch {
            return
        }
    });

    socket.on("playUNO", (payload) => {
        try {
            const ix = sesiones.SesionIdByCode(payload.code);
            if (ix != -1) {
                const { processed, player } = sesiones.sesiones[
                    ix
                ].game.players.getPlayerByIdentification(socket.id);
                if (processed) {
                    sesiones.sesiones[ix].game.arbitrarJugada(
                        sesiones.sesiones[ix].game.decirUNO(player)
                    );
                    updateMesaByIx(ix)
                }
            }
        } catch {
            return
        }
    });

    socket.on("reportarUNO", (payload) => {
        try {
            const ix = sesiones.SesionIdByCode(payload.code);
            if (ix != -1) {
                const { processed, player } = sesiones.sesiones[
                    ix
                ].game.players.getPlayerByIdentification(socket.id);
                if (processed) {
                    const jugador_ix = parseInt(payload.jugador, 10);
                    const total = sesiones.sesiones[ix].game.players.jugadores.length;
                    if (isNaN(jugador_ix) || jugador_ix < 0 || jugador_ix >= total) return;
                    const reportado = sesiones.sesiones[ix].game.players.getPlayerById(jugador_ix);
                    if (!reportado.player) return;
                    sesiones.sesiones[ix].game.arbitrarJugada(
                        sesiones.sesiones[ix].game.reportarJugadorConUnaCarta(player, reportado.player)
                    );
                    updateMesaByIx(ix)
                }
            }
        } catch {
            return
        }
    });

};



module.exports = {
    socketController,
};
