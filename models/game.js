const { Player, Players } = require("./players.js");

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
        [x] Si pasa sin levantar, es penalizado
        [x] Que pasa cuando no hay mas cartas para robar
        [x] No estoy ejecutando ninguna resolucion con la primer carta del descarte
        [x] Combos de cartas
        [ ] Deberia tener que poder descartar diciendo uno, para que no se haga en dos eventos distintos
        [ ] Tengo que marcar que dijo uno un jugador penalizado por no decir uno
        [ ] Tengo que quitar la bandera de que dijo uno, cuando el jugador es penalizado por jugar mal
  */

  constructor(jugadores = [], ronda = 0, espejito = 0) {
    this.elJuego = {
      jugadores: jugadores.length,
      ronda, //quien juega
      direccion: true, //para donde sigue el juego
      turno: jugadores[ronda % jugadores.length].nombre, //de quien es el turno
      levanto: false, //ya levanto
      color: "",
      penalidad: 0,
      espejito, //si se juega con espejito o no
      finalizo: false,
    };

    this.players = new Players(jugadores);
    this.ganadores = [];
    this.pila = [];

    this.pila = this.crearMBarajasCartas(Math.floor(jugadores.length / 4) + 1);
    this.pila = this.mezclarBarajas(this.pila);

    jugadores.forEach((jugador, ix) => {
      this.players.darCartaByIndex(ix, this.pila.slice(0, 7));
      this.pila = this.pila.slice(7);
    });

    this.descarte = this.pila.slice(0, 1);
    this.pila = this.pila.slice(1);

    this.procesarPrimeraCarta();
  }

  procesarPrimeraCarta() {
    const descarte = this.descarte[0];

    switch (descarte.valor) {
      case "girar":
        if (this.elJuego.direccion) {
          this.elJuego.direccion = false;
        } else {
          this.elJuego.direccion = true;
        }
        break;
      case "bloquear":
        if (this.elJuego.direccion) {
          this.elJuego.ronda = this.elJuego.ronda + 1;
        } else {
          if (this.elJuego.ronda > 1) {
            this.elJuego.ronda = this.elJuego.ronda - 1;
          } else {
            this.elJuego.ronda = this.elJuego.jugadores - 1;
          }
        }
        break;
      case "+2":
        this.elJuego.penalidad = this.elJuego.penalidad + 2;
        break;
      case "+4":
        this.elJuego.penalidad = this.elJuego.penalidad + 4;
        break;
      case "comodin":
        this.elJuego.color = "rojo";
        break;
    }
  }

  arbitrarJugada({ estado, jugador, carta, penalizado, reportado, color }) {
    if (!penalizado) {
      switch (estado) {
        case "levanto":
          this.elJuego.levanto = true;
          this.players.darCartaByJugador(jugador, carta);
          this.players.quitarUnoByJugador(jugador);
          this.pila = this.pila.slice(carta.length);
          break;
        case "descarto":
          this.elJuego.levanto = false;
          if (this.esUnaJugadaValida(carta)) {
            this.descarte.unshift(carta);
            this.players.descartarCartaByJugador(jugador, carta);
            this.siguienteTurno(jugador, carta ? carta : undefined, color);
          } else {
            this.players.darCartaByJugador(jugador, this.pila.slice(0, 1));
            this.pila = this.pila.slice(1);
            if (this.elJuego.penalidad) {
              this.players.darCartaByJugador(
                jugador,
                this.pila.slice(0, this.elJuego.penalidad)
              );
              this.pila = this.pila.slice(this.elJuego.penalidad);
              this.elJuego.penalidad = 0;
            }
            this.siguienteTurno(jugador, undefined, color);
            penalizado = true;
          }
          break;
        case "paso":
          this.elJuego.levanto = false;
          if (this.elJuego.penalidad) {
            this.players.darCartaByJugador(
              jugador,
              this.pila.slice(0, this.elJuego.penalidad)
            );
            this.pila = this.pila.slice(this.elJuego.penalidad);
            this.elJuego.penalidad = 0;
          }
          this.siguienteTurno(jugador, undefined, color);
          break;
        case "espejito":
          this.elJuego.levanto = false;
          if (this.esUnaJugadaValida(carta)) {
            this.descarte.unshift(carta);
            this.players.descartarCartaByJugador(jugador, carta);
            this.siguienteTurno(jugador, carta ? carta : undefined, color);
          } else {
            this.players.darCartaByJugador(jugador, this.pila.slice(0, 1));
            this.pila = this.pila.slice(1);
            penalizado = true;
          }
          break;
        case "uno":
          this.players.decirUnoByJugador(jugador);
          break;
        case "reporto":
          if (reportado) {
            this.players.darCartaByJugador(reportado, this.pila.slice(0, 2));
            this.pila = this.pila.slice(2);
            penalizado = false;
          }
          break;
        default:
      }

      if (this.players.getCartasByJugador(jugador).cartas.length == 0) {
        this.ganadores.push(jugador.nombre);
        this.players.quitarJugadorByJugador(jugador);
        this.elJuego.jugadores = this.elJuego.jugadores - 1;
      }
      if (this.elJuego.jugadores == 1) {
        this.elJuego.finalizo = true;
      }
    } else {
      this.players.darCartaByJugador(jugador, this.pila.slice(0, 1));
      this.pila = this.pila.slice(1);
      this.siguienteTurno(jugador, undefined, color);
      if (this.elJuego.penalidad) {
        this.players.darCartaByJugador(
          jugador,
          this.pila.slice(0, this.elJuego.penalidad)
        );
        this.pila = this.pila.slice(this.elJuego.penalidad);
        this.elJuego.penalidad = 0;
      }
    }

    return {
      carta,
      jugador,
      estado,
      penalizado,
      reportado,
    };
  }

  esUnaJugadaValida(carta) {
    /*
      Se puedo contrarrestar un +2 con un +4 segun esta regla?
    */
    const descarte = this.descarte.slice(0, 1);

    if (this.elJuego.penalidad) {
      if (
        (descarte[0].valor === "+2" && carta.valor === "+2") ||
        (descarte[0].valor === "+4" && carta.valor === "+4")
      ) {
        return true;
      }
      return false;
    } else if (
      carta.color === "negro" ||
      carta.color === descarte[0].color ||
      carta.valor === descarte[0].valor ||
      (descarte[0].color === "negro" && this.elJuego.color === carta.color)
    ) {
      return true;
    }
    return false;
  }

  siguienteTurno(jugador, carta, color) {
    this.elJuego.ronda = this.players.getIndexByJugador(jugador);

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
          if (this.elJuego.jugadores < 3) {
            if (this.elJuego.direccion) {
              this.elJuego.ronda = this.elJuego.ronda + 2;
            } else {
              if (this.elJuego.ronda > 1) {
                this.elJuego.ronda = this.elJuego.ronda - 2;
              } else {
                this.elJuego.ronda = this.elJuego.jugadores - 2;
              }
            }
          } else {
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
            this.elJuego.ronda = this.elJuego.ronda + 1;
          } else {
            if (this.elJuego.ronda > 0) {
              this.elJuego.ronda = this.elJuego.ronda - 1;
            } else {
              this.elJuego.ronda = this.elJuego.jugadores - 1;
            }
          }
          this.elJuego.penalidad = this.elJuego.penalidad + 2;
          break;
        case "+4":
          this.elJuego.color = color;
          if (this.elJuego.direccion) {
            this.elJuego.ronda = this.elJuego.ronda + 1;
          } else {
            if (this.elJuego.ronda > 0) {
              this.elJuego.ronda = this.elJuego.ronda - 1;
            } else {
              this.elJuego.ronda = this.elJuego.jugadores - 1;
            }
          }
          this.elJuego.penalidad = this.elJuego.penalidad + 4;
          break;
        case "comodin":
          this.elJuego.color = color;
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
    const { processed, player } = this.players.getPlayerById(
      this.elJuego.ronda % this.elJuego.jugadores
    );

    /*console.log("players", this.players)
    const { processed, player } =
      this.players.jugadores[this.elJuego.ronda % this.elJuego.jugadores];

    console.log(
      "pasando turno",
      this.elJuego.ronda,
      this.elJuego.jugadores,
      this.elJuego.ronda % this.elJuego.jugadores
    );*/

    //console.log(player)

    if (!processed) {
      throw "ERROR";
    }
    this.elJuego.turno = player.nombre;
  }

  levantarCartaDePila(jugador = new Player(), n = 1) {
    if (this.pila.length <= n) {
      this.pila.push(this.descarte.slice(1));
      this.descarte = this.descarte.slice(0, 1);
      this.pila = this.mezclarBarajas(this.pila);
    }

    let carta = this.pila.slice(0, n);
    let estado = "levanto";
    if (
      !this.elJuego.levanto &&
      this.elJuego.turno === jugador.nombre &&
      this.elJuego.penalidad == 0
    ) {
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

  descartarCarta(jugador = new Player(), carta, color) {
    let estado = "descarto";
    if (!jugador.cartas.includes(carta)) {
      return {
        carta,
        jugador,
        estado,
        color,
        penalizado: true,
      };
    }

    if (
      this.elJuego.espejito &&
      carta.color == this.descarte.slice(0, 1)[0].color &&
      carta.valor == this.descarte.slice(0, 1)[0].valor
    ) {
      let estado = "espejito";
      return {
        carta,
        jugador,
        estado,
        color,
        penalizado: false,
      };
    }

    if (this.elJuego.turno === jugador.nombre) {
      if (!carta && this.elJuego.levanto) {
        let estado = "paso";
        return {
          carta,
          jugador,
          estado,
          color,
          penalizado: false,
        };
      } else if (!carta && !this.elJuego.levanto) {
        return {
          carta,
          jugador,
          estado,
          color,
          penalizado: true,
        };
      }

      return {
        carta,
        jugador,
        estado,
        color,
        penalizado: false,
      };
    } else {
      return {
        carta,
        jugador,
        estado,
        color,
        penalizado: true,
      };
    }
  }
  pasarTurnoSinJugar(jugador = new Player()) {
    let estado = "paso";
    if (
      (this.elJuego.levanto || this.elJuego.penalidad) &&
      this.elJuego.turno === jugador.nombre
    ) {
      return {
        jugador,
        estado,
        penalizado: false,
      };
    } else {
      return {
        jugador,
        estado,
        penalizado: true,
      };
    }
  }

  decirUNO(jugador = new Player()) {
    let estado = "uno";
    if (jugador.cartas.length < 2) {
      return {
        jugador,
        estado,
        penalizado: false,
      };
    } else {
      return {
        jugador,
        estado,
        penalizado: true,
      };
    }
  }

  reportarJugadorConUnaCarta(jugador = new Player(), reportado = new Player()) {
    let estado = "reporto";

    if (
      this.elJuego.turno != reportado.nombre &&
      reportado.cartas.length == 1 &&
      reportado.saidUno == false
    ) {
      return {
        jugador,
        reportado,
        estado,
        penalizado: false,
      };
    } else {
      return {
        jugador,
        estado,
        penalizado: false,
      };
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
