const Game = require("./game");

class Persona {
  constructor(nombre, role) {
    this.nombre = nombre;
    this.role = role;
  }
}

class Sesion {
  constructor(id, socketId, administrador, game = null) {
    this.id = id; //Este Id es solo para tener un orden
    this.socketId = socketId; //Esto es el link
    this.players = [{ nombre: administrador, role: "admin", id: socketId }]; //Es la lista de los nombres de los jugadores
    this.game = game; //Es el juego en curso
    this.ronda = 0;
  }
}

class Sesiones {
  constructor() {
    this.sesiones = [];
  }

  /*Devuelve el SocketId de la mesa*/
  removerSesionesBySocketId(socketId) {
    this.sesiones = this.sesiones.filter((sesion) => {
      return sesion.socketId != socketId;
    });
    const ix = this.getSesionFromSocketId(socketId);

    if (ix >= 0) {
      this.sesiones[ix].players = this.sesiones[ix].players.filter((p) => {
        return p.id != socketId;
      });
      return this.sesiones[ix].socketId;
    }
    return -1;
  }

  removePlayer(socketId, playerId) {
    const ix = this.getSesionFromSocketId(socketId);

    if (ix >= 0) {
      this.sesiones[ix].players = this.sesiones[ix].players.filter((p) => {
        return p.id != playerId;
      });
      return true;
    }
    return -1;
  }

  /*devuelve el indice de la sesion que contenga un usuario con socketId = socketId*/
  getSesionFromSocketId(socketId) {
    if (this.sesiones.length == 0) {
      return -1;
    }
    let ix = this.sesiones.findIndex((p) => {
      return p.players.find((e) => {
        return e.id == socketId;
      });
    });
    return ix;
  }

  existeSesionBySocketId(socketId) {
    let ix = this.sesiones.findIndex((p) => {
      return p.socketId === socketId;
    });
    return ix;
  }

  addSesion(sesion) {
    this.sesiones.push(new Sesion(sesion.id, sesion.socketId, sesion.nombre));
  }

  getSesiones() {
    return this.sesiones;
  }

  getSesionById(id) {
    let ix = this.sesiones.findIndex((p) => {
      return p.id === id;
    });
    return ix;
  }

  addPlayerToSession(nombre, codigo, socketId) {
    let socket = codigo.split("-").join("");
    let ix = this.sesiones.findIndex((p) => {
      return (
        p.socketId
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .slice(0, 9)
          .toLowerCase() === socket
      );
    });

    if (ix >= 0) {
      this.sesiones[ix].players.push({
        nombre: nombre,
        role: "",
        id: socketId,
      });
      return true;
    }
    return false;
  }

  SesionIdByCode(code) {
    let socket = code.split("-").join("");
    let ix = this.sesiones.findIndex((p) => {
      return (
        p.socketId
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .slice(0, 9)
          .toLowerCase() === socket
      );
    });

    return ix
  }

  crearNewGameToSession(socketId) {
    const ix = this.getSesionFromSocketId(socketId);
    if (ix != -1) {
        const jugadores = this.sesiones[ix].players;
        this.sesiones[ix].game = new Game(jugadores,this.sesiones[ix].ronda++,true);
    }
    return ix;
  }

  getMesaSocketId(codigo) {
    let socket = codigo.split("-").join("");
    let ix = this.sesiones.findIndex((p) => {
      return (
        p.socketId
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .slice(0, 9)
          .toLowerCase() === socket
      );
    });

    if (ix >= 0) {
      return this.sesiones[ix].socketId;
    }
    return -1;
  }

  /*setJugador(gameId, nombre, password) {
    this.sesiones[this.getSesionById(gameId)].players.push(nombre);
    return true;
  }*/
}

module.exports = { Sesiones };
