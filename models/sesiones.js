class Sesion {
    constructor({ id, socketId, salon, password, jugadores, jugando = 0, game = null }) {
        this.id = id;
        this.socketId = socketId;
        this.salon = salon;
        this.password = password;
        this.jugadores = jugadores;
        this.jugando = jugando
        this.game = game;
        this.players = []
    }
}

class Sesiones {
    constructor() {
        this.sesiones = []
    }

    removerSesionesBySocketId(socketId) {

        this.sesiones = this.sesiones.filter(sesion => {
            return (sesion.socketId != socketId)
        })

    }

    addSesion(sesion = new Sesion) {
        this.sesiones.push(new Sesion(sesion))
    }

    getSesiones() {
        return this.sesiones
    }

    getSesionById(id) {
        let ix = this.sesiones.findIndex(p => {
            return p.id === id
        })
        return ix
    }

    setJugador(gameId, nombre, password) {

        console.log(this.sesiones[this.getSesionById(gameId)],"pass", this.sesiones[this.getSesionById(gameId)].password, "pass",password)
        if (this.sesiones[this.getSesionById(gameId)].password === password) {
            this.sesiones[this.getSesionById(gameId)].players.push(nombre)
            this.sesiones[this.getSesionById(gameId)].jugando += 1
            return true
        }
        return false
    }

}

module.exports = Sesiones;
