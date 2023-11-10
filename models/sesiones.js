class Sesion {
    constructor({ id, socketId, salon, password, jugadores, jugando = 0, game = null }) {
        this.id = id;
        this.socketId = socketId;
        this.salon = salon;
        this.password = password;
        this.jugadores = jugadores;
        this.jugando = jugando
        this.game = game;
    }
}

class Sesiones {
    constructor(){
        this.sesiones= []
    }

    removerSesionesBySocketId(socketId){
               
        this.sesiones = this.sesiones.filter(sesion => {
            return (sesion.socketId != socketId)
        })

    }

    addSesion(sesion = new Sesion){
        this.sesiones.push(sesion)
    }

    getSesiones() {
        return this.sesiones
    }

}

module.exports = Sesiones;
