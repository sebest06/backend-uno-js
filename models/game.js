class Carta {
  constructor({ color, valor }) {
    this.color = color;
    this.valor = valor;
    this.nombre = () => {
      return `${color}_${valor}`;
    };
  }
}

class Player {
  constructor({ nombre, cartas = [] }) {
    this.nombre = nombre;
    this.saidUno = false;
    this.cartas = cartas;
  }
}

class Game {
  /* TODO:
    De que se compone el juego?
        * La pila de cartas para juntar
        * La pila de descarte
        * Los jugadores (las cartas del jugador, si canto uno, si es el turno de él)
        * El Arbitro
    Que objetos vamos a tener?
        * Game
        * Carta
        * Jugador
        * Arbitro 
    */

  constructor(jugadores = [], ronda = 0, espejito = 0) {
    this.elJuego = {
      ronda, //quien juega
      direccion: true, //para donde sigue el juego
      turno: jugadores[ronda % jugadores.length].nombre, //de quien es el turno
      levanto: false, //ya levanto
      espejito, //si se juega con espejito o no
    };

    //this.arbitro = false
    this.jugadores = [];
    this.pila = [];
    /*this.ronda = ronda
    this.direccion = true*/

    this.pila = this.crearMBarajasCartas(
      Math.floor(this.jugadores.length / 4) + 1
    );
    this.pila = this.mezclarBarajas(this.pila);
    /*console.log("Cartas en la pila:", this.pila.length)
    this.pila.forEach((carta) => {
      console.log(carta.nombre())
    })*/

    jugadores.forEach((jugador) => {
      const unPlayer = new Player({
        nombre: jugador.nombre,
        cartas: this.pila.slice(0, 7),
      });
      this.jugadores.push(unPlayer);
      this.pila = this.pila.slice(7);

      /*unPlayer.cartas.forEach((carta) => {
        console.log(jugador.nombre, carta.nombre());
      });*/
    });

    this.descarte = this.pila.slice(0, 1);
    this.pila = this.pila.slice(1);

    /*
    let salida;
    console.log("TURNO:",this.elJuego.turno)
    salida = this.levantarCartaDePila(this.jugadores[0])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")
    salida = this.pasarTurnoSinJugar(this.jugadores[0])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")

    salida = this.pasarTurnoSinJugar(this.jugadores[2])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")

    salida = this.levantarCartaDePila(this.jugadores[0])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")

    this.descartarCarta(this.jugadores[0], this.jugadores[0].cartas[1])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")


    console.log("TURNO:",this.elJuego.turno)
    salida = this.levantarCartaDePila(this.jugadores[1])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")
    salida = this.pasarTurnoSinJugar(this.jugadores[1])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")

    console.log("TURNO:",this.elJuego.turno)
    salida = this.levantarCartaDePila(this.jugadores[2])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")
    this.descartarCarta(this.jugadores[2], this.jugadores[2].cartas[1])
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")
    */
  }

  revisarJugada({estado, jugador, carta, penalizado, reportado}) {
        

  }
  
  levantarCartaDePila(jugador = new Player()) {
    let carta = this.pila.slice(0, 1);
    let estado = 'levanto'
    
    //console.log("TEST LEVANTAR: levanto", this.elJuego.levanto, "jugador: ", this.elJuego.turno, jugador.nombre)
    if (!this.elJuego.levanto && this.elJuego.turno === jugador.nombre) {
      //levantara una carta y podrá jugar
      this.elJuego.levanto = true;
      return {
        carta,
        jugador,
        estado,
        penalizado: false,
      }
    } else {
      //levantara una carta en penalización
      return {
        carta,
        jugador,
        estado,
        penalizado: true,
      }
    }
  }

  descartarCarta(jugador = new Player(), carta) {
    let estado = 'descarto'
    if (!jugador.cartas.includes(carta)) {
      return {
        carta,
        jugador,
        estado,
        penalizado: true,
      };
    }

    if (this.elJuego.espejito && carta == this.descarte.slice(0, 1)) {
        this.elJuego.levanto = false;

        this.elJuego.ronda = this.jugadores.indexOf(jugador)

        if (this.elJuego.direccion) {
            this.elJuego.ronda = this.elJuego.ronda+1;
          } else {
            if (this.elJuego.ronda > 0) {
              this.elJuego.ronda = this.elJuego.ronda-1;
            } else {
              this.elJuego.ronda = this.jugadores.length - 1;
            }
          }
          this.elJuego.turno =
            this.jugadores[this.elJuego.ronda % this.jugadores.length].nombre;

      return {
        carta,
        jugador,
        estado,
        penalizado: false,
      };
    }

    if (this.elJuego.turno === jugador.nombre) {

      this.elJuego.levanto = false;
      if (this.elJuego.direccion) {
        this.elJuego.ronda = this.elJuego.ronda+1;
      } else {
        if (this.elJuego.ronda > 0) {
          this.elJuego.ronda = this.elJuego.ronda-1;
        } else {
          this.elJuego.ronda = this.jugadores.length - 1;
        }
      }

      this.elJuego.turno =
        this.jugadores[this.elJuego.ronda % this.jugadores.length].nombre;
      //descarta la carta y pasa al siguiente jugador
      return {
        carta,
        jugador,
        estado,
        penalizado: false,
      };
    } else {
      //no puede descartar la carta y es penalizado
      return {
        carta,
        jugador,
        estado,
        penalizado: true,
      };
    }
  }
  pasarTurnoSinJugar(jugador = new Player()) {
    let estado = 'paso'
    if (this.elJuego.levanto && this.elJuego.turno === jugador.nombre) {
        this.elJuego.levanto = false;
      if (this.elJuego.direccion) {
        this.elJuego.ronda = this.elJuego.ronda+1;
      } else {
        if (this.elJuego.ronda > 0) {
          this.elJuego.ronda = this.elJuego.ronda-1;
        } else {
          this.elJuego.ronda = this.jugadores.length - 1;
        }
      }
      this.elJuego.turno =
        this.jugadores[this.elJuego.ronda % this.jugadores.length].nombre;
      return {
        jugador,
        estado,
        penalizado: false,
      };
    } else {
      //no hay penalidad por pasar sin no era tu turno
      return {
        jugador,
        estado,
        penalizado: false
      };
    }
  }

  decirUNO(jugador = new Player()){
    let estado = 'uno'
    if (jugador.cartas.length < 2){
        return {
            jugador,
            estado,
            penalizado: false
        }
    }else {
        return {
            jugador,
            estado,
            penalizado: true
        }
    }
  }

  reportarJugadorConUnaCarta(jugador = new Player(), reportado = new Player()) {
    let estado="reporta"
    if(this.elJuego.levanto && reportado.cartas.length == 1){
        return {
            jugador,
            reportado,
            estado,
            penalizado: false
        }
    }else {
        return {
            jugador,
            estado,
            penalizado: false
        }
    }
  }

  crearMBarajasCartas(mBarajas) {
    let baraja = [];
    for (let m = 0; m < mBarajas; m++) {
      //console.log((jugadores.length / 4) + 1);
      let color = "rojo";
      for (let i = 0; i < 10; i++) {
        baraja.push(
          new Carta({
            color,
            valor: `${i}`,
          })
        );
      }
      baraja.push(
        new Carta({
          color,
          valor: "girar",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "bloquear",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "+2",
        })
      );

      color = "verde";
      for (let i = 0; i < 10; i++) {
        baraja.push(
          new Carta({
            color,
            valor: `${i}`,
          })
        );
      }
      baraja.push(
        new Carta({
          color,
          valor: "girar",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "bloquear",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "+2",
        })
      );

      color = "azul";
      for (let i = 0; i < 10; i++) {
        baraja.push(
          new Carta({
            color,
            valor: `${i}`,
          })
        );
      }
      baraja.push(
        new Carta({
          color,
          valor: "girar",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "bloquear",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "+2",
        })
      );

      color = "amarillo";
      for (let i = 0; i < 10; i++) {
        baraja.push(
          new Carta({
            color,
            valor: `${i}`,
          })
        );
      }
      baraja.push(
        new Carta({
          color,
          valor: "girar",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "bloquear",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "+2",
        })
      );

      color = "negro";
      baraja.push(
        new Carta({
          color,
          valor: "+4",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "+4",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "comodin",
        })
      );
      baraja.push(
        new Carta({
          color,
          valor: "comodin",
        })
      );
    }
    return baraja;
  }
  mezclarBarajas(array = []) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

module.exports = Game;
