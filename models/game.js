const { Player, Players } = require('./players.js')

class Carta {
  constructor({ color, valor }) {
    this.color = color;
    this.valor = valor;
    this.nombre = () => {
      return `${color}_${valor}`;
    };
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
    Cosas a considerar:
        * Que pasa cuando no hay mas cartas para robar
    */

  constructor(jugadores = [], ronda = 0, espejito = 0) {
    this.elJuego = {
      jugadores: jugadores.length,
      ronda, //quien juega
      direccion: true, //para donde sigue el juego
      turno: jugadores[ronda % jugadores.length].nombre, //de quien es el turno
      levanto: false, //ya levanto
      color: "",
      espejito, //si se juega con espejito o no
      finalizo: false
    };

    this.players = new Players(jugadores)
    this.ganadores = []
    this.pila = []

    this.pila = this.crearMBarajasCartas(
      Math.floor(jugadores.length / 4) + 1
    );
    this.pila = this.mezclarBarajas(this.pila);

    jugadores.forEach((jugador, ix) => {
      this.players.darCartaByIndex(ix, this.pila.slice(0, 7))
      this.pila = this.pila.slice(7);
    });

    this.descarte = this.pila.slice(0, 1);
    this.pila = this.pila.slice(1);


    let salida;
    console.log("A-TURNO:", this.elJuego.turno, this.players.getPlayerById(0).player)
    salida = this.arbitrarJugada(this.levantarCartaDePila(this.players.getPlayerById(0).player))
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")

    console.log("A-TURNO:", this.elJuego.turno, this.players.getPlayerById(0).player)
    salida = this.arbitrarJugada(this.pasarTurnoSinJugar(this.players.getPlayerById(0).player))
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")
    console.log("TURNO:", this.elJuego.turno)

    salida = this.arbitrarJugada(this.pasarTurnoSinJugar(this.players.getPlayerById(2).player))
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")

    salida = this.arbitrarJugada(this.levantarCartaDePila(this.players.getPlayerById(0).player))
    salida.penalizado != false ? console.log("OK") : console.log("FAIL")

    salida = this.arbitrarJugada(this.descartarCarta(this.players.getPlayerById(0).player, this.players.getPlayerById(0).player.cartas[1]))
    salida.penalizado != false ? console.log("OK") : console.log("FAIL")


    console.log("TURNO:", this.elJuego.turno)
    salida = this.arbitrarJugada(this.levantarCartaDePila(this.players.getPlayerById(1).player))
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")
    salida = this.arbitrarJugada(this.pasarTurnoSinJugar(this.players.getPlayerById(1).player))
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")

    console.log("TURNO:", this.elJuego.turno)
    salida = this.arbitrarJugada(this.levantarCartaDePila(this.players.getPlayerById(2).player))
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")
    salida = this.arbitrarJugada(this.descartarCarta(this.players.getPlayerById(2).player, this.players.getPlayerById(2).player.cartas[1]))
    salida.penalizado == false ? console.log("OK") : console.log("FAIL")
  }

  arbitrarJugada({ estado, jugador, carta, penalizado, reportado, color }) {

    console.log("PENAL", penalizado, "ESTADO", estado)
    if (!penalizado) {
      switch (estado) {
        case 'levanto':
          this.elJuego.levanto = true;
          this.players.darCartaByJugador(jugador, carta)
          this.pila = this.pila.slice(carta.length)
          break;
        case 'descarto':
          this.elJuego.levanto = false;
          if (this.esUnaJugadaValida(carta[0])) {
            this.descarte.push(carta)
            this.players.descartarCartaByJugador(jugador, carta);
            this.siguienteTurno(jugador, carta ? carta[0] : undefined, color)
          } else {
            this.players.darCartaByJugador(jugador, this.pila.slice(0, 1))
            this.pila = this.pila.slice(1)
            this.siguienteTurno(jugador, undefined, color)
          }
          
          break;
        case 'paso':
          this.elJuego.levanto = false;
          this.siguienteTurno(jugador, undefined, color)
          break;
        case 'espejito':
          this.elJuego.levanto = false;
          if (this.esUnaJugadaValida(carta[0])) {
            this.descarte.push(carta)
            this.players.descartarCartaByJugador(jugador, carta);
            this.siguienteTurno(jugador, carta ? carta[0] : undefined, color)
          } else {
            this.players.darCartaByJugador(jugador, this.pila.slice(0, 1))
            this.pila = this.pila.slice(1)
          }
          
          break;
        case 'uno':
          break;
        case 'reporto':
          break
        default:
      }

      if (this.players.getCartasByJugador(jugador).cartas.length) {
        this.ganadores.push(jugador.nombre)
        this.players.quitarJugadorByJugador(jugador)
        this.elJuego.jugadores = this.elJuego.jugadores - 1
      }
      if (this.elJuego.jugadores == 1) {
        this.elJuego.finalizo = true
      }
    } else {
      this.players.darCartaByJugador(jugador, this.pila.slice(0, 1))
      this.pila = this.pila.slice(1)
      this.siguienteTurno(jugador, undefined, color)
    }

    return {
      carta,
      jugador,
      estado,
      penalizado,
      reportado
    }
  }

  esUnaJugadaValida(carta) {
    const descarte = this.descarte.slice(0, 1);
    if (carta.color == "negro" || carta.color == descarte[0].color || carta.valor == descarte[0].valor || (descarte.color == "negro" && this.elJuego.color == carta.color)) {
      return true
    }
  }

  siguienteTurno(jugador, carta, color) {

    console.log("Pasa de turno")
    this.elJuego.ronda = this.players.getIndexByJugador(jugador)

    if (!carta) {
      if (this.elJuego.direccion) {
        this.elJuego.ronda = this.elJuego.ronda + 1;
      } else {
        if (this.elJuego.ronda > 0) {
          this.elJuego.ronda = this.elJuego.ronda - 1;
        } else {
          this.elJuego.ronda = this.elJuego.jugadores - 1;
        }
      }
      console.log("Direccion", this.elJuego.direccion, "ronda", this.elJuego.ronda)
    } else {
      switch (carta.valor) {
        case "bloquear":
          if (this.elJuego.direccion) {
            this.elJuego.ronda = this.elJuego.ronda + 2;
          } else {
            if (this.elJuego.ronda > 1) {
              this.elJuego.ronda = this.elJuego.ronda - 2;
            } else {
              this.elJuego.ronda = this.elJuego.jugadores - 2;
            }
          }
          break;
        case "girar":
          if (this.elJuego.direccion) {
            this.elJuego.direccion = false;
          } else {
            this.elJuego.direccion = true;
          }
          if (this.elJuego.jugadores < 2) {
            if (this.elJuego.direccion) {
              this.elJuego.ronda = this.elJuego.ronda + 1;
            } else {
              if (this.elJuego.ronda > 0) {
                this.elJuego.ronda = this.elJuego.ronda - 1;
              } else {
                this.elJuego.ronda = this.elJuego.jugadores - 1;
              }
            }
          }
          break;
        case "+2":
          if (this.elJuego.direccion) {
            this.elJuego.ronda = this.elJuego.ronda + 2;
          } else {
            if (this.elJuego.ronda > 1) {
              this.elJuego.ronda = this.elJuego.ronda - 2;
            } else {
              this.elJuego.ronda = this.elJuego.jugadores - 2;
            }
          }
          break;
        case "+4":
          this.elJuego.color = color
          if (this.elJuego.direccion) {
            this.elJuego.ronda = this.elJuego.ronda + 2;
          } else {
            if (this.elJuego.ronda > 1) {
              this.elJuego.ronda = this.elJuego.ronda - 2;
            } else {
              this.elJuego.ronda = this.elJuego.jugadores - 2;
            }
          }
          break;
        case "comodin":
          this.elJuego.color = color
          if (this.elJuego.direccion) {
            this.elJuego.ronda = this.elJuego.ronda + 1;
          } else {
            if (this.elJuego.ronda > 0) {
              this.elJuego.ronda = this.elJuego.ronda - 1;
            } else {
              this.elJuego.ronda = this.elJuego.jugadores - 1;
            }
          }
          break;
        default:
          if (this.elJuego.direccion) {
            this.elJuego.ronda = this.elJuego.ronda + 1;
          } else {
            if (this.elJuego.ronda > 0) {
              this.elJuego.ronda = this.elJuego.ronda - 1;
            } else {
              this.elJuego.ronda = this.elJuego.jugadores - 1;
            }
          }
      }
    }
    const {processed, player} = this.players.getPlayerById(this.elJuego.ronda % this.elJuego.jugadores)
    if(!processed) {
      throw "ERROR"
    }
    this.elJuego.turno = player.nombre
  }

  levantarCartaDePila(jugador = new Player(), n = 1) {

    if (this.pila.length <= n) {
      this.pila.push(this.descarte.slice(1))
      this.descarte = this.descarte.slice(0, 1)
      this.pila = this.mezclarBarajas(this.pila)
    }

    let carta = this.pila.slice(0, n);
    let estado = 'levanto'
    if (!this.elJuego.levanto && this.elJuego.turno === jugador.nombre) {
      return {
        carta,
        jugador,
        estado,
        penalizado: false,
      }
    } else {
      return {
        carta,
        jugador,
        estado,
        penalizado: true,
      }
    }
  }

  descartarCarta(jugador = new Player(), carta, color) {
    let estado = 'descarto'

    if (!jugador.cartas.includes(carta)) {
      return {
        carta,
        jugador,
        estado,
        color,
        penalizado: true,
      };
    }

    if (this.elJuego.espejito && carta == this.descarte.slice(0, 1)) {
      let estado = 'espejito'
      return {
        carta,
        jugador,
        estado,
        penalizado: false,
      };
    }

    if (this.elJuego.turno === jugador.nombre) {

      if (!carta && this.elJuego.levanto) {
        let estado = 'paso'
      } else {
        return {
          carta,
          jugador,
          estado,
          penalizado: true,
        }
      }

      return {
        carta,
        jugador,
        estado,
        penalizado: false,
      };
    } else {
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
    console.log("turno",this.elJuego.turno,jugador.nombre)
    if (this.elJuego.levanto && this.elJuego.turno === jugador.nombre) {
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
        penalizado: true
      };
    }
  }

  decirUNO(jugador = new Player()) {
    let estado = 'uno'
    if (jugador.cartas.length < 2) {
      return {
        jugador,
        estado,
        penalizado: false
      }
    } else {
      return {
        jugador,
        estado,
        penalizado: true
      }
    }
  }

  reportarJugadorConUnaCarta(jugador = new Player(), reportado = new Player()) {
    let estado = "reporta"
    if (this.elJuego.levanto && reportado.cartas.length == 1) {
      return {
        jugador,
        reportado,
        estado,
        penalizado: false
      }
    } else {
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
