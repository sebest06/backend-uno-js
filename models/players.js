class Player {
    constructor({ nombre, cartas = [] }) {
        this.nombre = nombre;
        this.saidUno = false;
        this.cartas = cartas;
    }
}



class Players {
    constructor(lista_jugadores = []) {
        this.jugadores = [];
        lista_jugadores.forEach((jugador) => {
            const unPlayer = new Player({
                nombre: jugador.nombre,
                cartas: [],
                saidUno: false
            });
            this.jugadores.push(unPlayer);
        })
    }

    getIndexPlayerByNombre(nombre = "") {
        let ix = this.jugadores.findIndex(p => {
            return p.nombre === nombre
        })
        return ix
    }
    getIndexByJugador(jugador = new Player()) {
        let ix = this.jugadores.findIndex(p => {
            return p === jugador
        })
        return ix;
    }

    getPlayerById(id = 0){
        if(id < 0 ){
            return {
                processed: false
            }
        }
        return {
            processed: true,
            player: this.jugadores[id]
        }
    }
    getPlayerByNombre(nombre = ""){
        let ix = this.getIndexPlayerByNombre(nombre);
        if(ix<0){
            return {
                processed: false
            }
        }
        return {
            processed: true,
            player: this.jugadores[ix]
        }
    }

    darCartaByIndex(index = 0, cartas = []) {
        if (index < 0) {
            return {
                processed: false
            }
        }
        let _cartas = this.jugadores[index].cartas
        _cartas.push(cartas)
        this.jugadores[index].cartas = _cartas
        this.jugadores[index].saidUno = false
        return {
            processed: true
        }
    }

    darCartaByNombre(nombre = "", cartas = []) {
        let ix = this.getIndexPlayerByNombre(nombre)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.darCartaByIndex(ix, cartas)
    }
    darCartaByJugador(jugador = new Player(), cartas = []) {
        let ix = this.getIndexByJugador(jugador)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.darCartaByIndex(ix, cartas)
    }

    descartarCartaByIndex(index = 0, cartas = []) {
        if (index < 0) {
            return {
                processed: false
            }
        }
        let _cartas = this.jugadores[index].cartas

        if (!_cartas.includes(cartas)) {
            return {
                processed: false
            }
        }

        _cartas = _cartas.filter(c => {
            if (!cartas.includes(c)) {
                return true
            }
            return false
        })
        this.jugadores[index].cartas = _cartas

        return {
            processed: true
        }
    }
    descartarCartaByNombre(nombre = "", cartas = []) {
        let ix = this.getIndexPlayerByNombre(nombre)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.descartarCartaByIndex(ix, cartas)
    }
    descartarCartaByJugador(jugador = new Player(), cartas = []) {
        let ix = this.getIndexByJugador(jugador)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.descartarCartaByIndex(ix, cartas)
    }

    getCartasById(index = 0){
        if (index < 0) {
            return {
                processed: false
            }
        }

        //console.log("index:", index, "QUE ES ESTO?:", this.jugadores)
        let cartas = this.jugadores[index].cartas
        return {
            processed: true,
            cartas
        }
    }
    getCartasByNombre(nombre = ""){
        let ix = this.getIndexPlayerByNombre(nombre)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.getCartasById(ix)
    }
    getCartasByJugador(jugador = new Player()){
        let ix = this.getIndexByJugador(jugador)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.getCartasById(ix)
    }

    decirUnoById(index = 0){
        if (index < 0) {
            return {
                processed: false
            }
        }
        this.jugadores[index].saidUno = true
        return {
            processed: true,
        }
    }

    decirUnoByNombre(nombre = ""){
        let ix = this.getIndexPlayerByNombre(nombre)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.decirUnoById(ix)
    }

    decirUnoByJugador(jugador = new Player()){
        let ix = this.getIndexByJugador(jugador)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.decirUnoById(ix)
    }

    dejoUnoById(index = 0){
        if (index < 0) {
            return {
                processed: false
            }
        }

        return {
            processed: true,
            uno: this.jugadores[index].saidUno
        }
    }

    dejoUnoByNombre(nombre = ""){
        let ix = this.getIndexPlayerByNombre(nombre)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.dejoUnoById(ix)
    }

    dejoUnoByJugador(jugador = new Player()){
        let ix = this.getIndexByJugador(jugador)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        return this.dejoUnoById(ix)
    }

    quitarJugadorByJugador(jugador = new Player()) {
        let ix = this.getIndexByJugador(jugador)
        if (ix < 0) {
            return {
                processed: false
            }
        }
        this.jugadores = this.jugadores.filter ((j,index) => {
            if(index != ix) {
                return true
            } else {
                return false
            }
        })
    }

}

module.exports = { Players, Player };