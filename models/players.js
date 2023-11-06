class Player {
    constructor({ id, nombre, cartas = [] }) {
        this.nombre = nombre;
        this.saidUno = false;
        this.cartas = cartas;
        this.id = id;
    }
}



class Players {
    constructor(lista_jugadores = []) {
        this.jugadores = [];
        let ix = 0;
        lista_jugadores.forEach((jugador) => {
            const unPlayer = new Player({
                id: ix++,
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

        let ix = this.jugadores.findIndex(p => {
            return p.id === id
        })

        return {
            processed: true,
            player: this.jugadores[ix]
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

        let ix = this.jugadores.findIndex(p => {
            return p.id === index
        })

        let _cartas = this.jugadores[ix].cartas
        _cartas.push(cartas)
        this.jugadores[ix].cartas = _cartas
        this.jugadores[ix].saidUno = false
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

        let ix = this.jugadores.findIndex(p => {
            return p.id === index
        })

        let _cartas = this.jugadores[ix].cartas

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
        this.jugadores[ix].cartas = _cartas

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

        let ix = this.jugadores.findIndex(p => {
            return p.id === index
        })

        //console.log("index:", index, "QUE ES ESTO?:", this.jugadores)
        let cartas = this.jugadores[ix].cartas
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

        let ix = this.jugadores.findIndex(p => {
            return p.id === index
        })

        this.jugadores[ix].saidUno = true
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

        let ix = this.jugadores.findIndex(p => {
            return p.id === index
        })

        return {
            processed: true,
            uno: this.jugadores[ix].saidUno
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