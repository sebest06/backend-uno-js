const { Players } = require("../models/players");
const Game = require("../models/game");
const fakegame = require("./faketest");
const fakegame2 = require("./faketest2");
const fakegame3 = require("./faketest3");
const fakegame4 = require("./faketest4");

class Testeador {
    constructor (){
        console.log("=== FAKE GAME TEST ===");

        this.uno_game = new Game([{nombre: "seba"},{nombre: "ara"},{nombre: "jaq"},{nombre: "geo"},{nombre: "fede"}],0,true);
        this.crearFakeMockGame(fakegame);
        this.crearFakeMockGame2(fakegame2)
        this.crearFakeMockGame2(fakegame3)
        this.crearFakeMockGame4(fakegame4)
        console.log("=== END FAKE GAME TEST ===");

    }

    crearFakeMockGame4(json_fake = {}) {
        //  console.log(json_fake.pila)
        const jugadores_json = json_fake.jugadores.jugadores;
    
        this.elJuego = {
          jugadores: jugadores_json.length,
          ronda: json_fake.reglas.ronda, //quien juega
          direccion: true, //para donde sigue el juego
          turno:
            jugadores_json[json_fake.reglas.ronda % jugadores_json.length].nombre, //de quien es el turno
          levanto: false, //ya levanto
          color: "",
          penalidad: 0,
          espejito: json_fake.reglas.espejito, //si se juega con espejito o no
          finalizo: false,
        };
    
        this.ganadores = [];
        this.pila = json_fake.pila;
        this.descarte = json_fake.descarte;
    
        let list_players = [];
        jugadores_json.forEach((p) => {
          list_players.push(p.nombre);
        });
    
        this.players = new Players(list_players);
        this.players.jugadores = json_fake.jugadores.jugadores;
    
        let salida;
        this.procesarPrimeraCarta();
    
        this.elJuego.finalizo == false ? console.log("OK") : console.log("FAIL");
    
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
    
        //amarillo  2
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0]
          )
        );
    
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //amarillo 0
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        // rojo 0
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
    
        //geo espejito rojo 0
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //girar rojo
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //bloquear rojo
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
    
        //espejito bloquear rojo jaq
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
    
    
        //console.log(this.players.getPlayerById(1).player.cartas)
    
      }
    
      crearFakeMockGame2(json_fake = {}) {
        //  console.log(json_fake.pila)
        const jugadores_json = json_fake.jugadores.jugadores;
    
        this.elJuego = {
          jugadores: jugadores_json.length,
          ronda: json_fake.reglas.ronda, //quien juega
          direccion: true, //para donde sigue el juego
          turno:
            jugadores_json[json_fake.reglas.ronda % jugadores_json.length].nombre, //de quien es el turno
          levanto: false, //ya levanto
          color: "",
          penalidad: 0,
          espejito: json_fake.reglas.espejito, //si se juega con espejito o no
          finalizo: false,
        };
    
        this.ganadores = [];
        this.pila = json_fake.pila;
        this.descarte = json_fake.descarte;
    
        let list_players = [];
        jugadores_json.forEach((p) => {
          list_players.push(p.nombre);
        });
    
        this.players = new Players(list_players);
        this.players.jugadores = json_fake.jugadores.jugadores;
    
        let salida;
        this.procesarPrimeraCarta();
    
        this.elJuego.finalizo == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
    
        //verde 1
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0]
          )
        );
    
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde girar
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0],
            "amarillo"
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        //comodin amarillo
    
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(1).player)
        );
        salida.penalizado == true ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.finalizo == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0],
            "amarillo"
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.ganadores[0] == "seba" ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.finalizo == true ? console.log("OK") : console.log("FAIL");
    
    
        //console.log(this.players.getPlayerById(1).player.cartas)
    
      }
    
    
    
      crearFakeMockGame(json_fake = {}) {
        //  console.log(json_fake.pila)
        const jugadores_json = json_fake.jugadores.jugadores;
    
        this.elJuego = {
          jugadores: jugadores_json.length,
          ronda: json_fake.reglas.ronda, //quien juega
          direccion: true, //para donde sigue el juego
          turno:
            jugadores_json[json_fake.reglas.ronda % jugadores_json.length].nombre, //de quien es el turno
          levanto: false, //ya levanto
          color: "",
          penalidad: 0,
          espejito: json_fake.reglas.espejito, //si se juega con espejito o no
          finalizo: false,
        };
    
        this.ganadores = [];
        this.pila = json_fake.pila;
        this.descarte = json_fake.descarte;
    
        let list_players = [];
        jugadores_json.forEach((p) => {
          list_players.push(p.nombre);
        });
    
        this.players = new Players(list_players);
        this.players.jugadores = json_fake.jugadores.jugadores;
    
        let salida;
        this.procesarPrimeraCarta();
    
        // Turno Seba: Hay un +2 amarillo, junto 2 cartas
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(0).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //Tengo que tener 9 cartas
        this.players.getCartasById(0).cartas.length == 9
          ? console.log("OK")
          : console.log("FAIL");
    
        // Turno Ara:
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //Tengo que tener 8 cartas
        this.players.getCartasById(1).cartas.length == 8
          ? console.log("OK")
          : console.log("FAIL");
        //Descarto el +2 azul
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[7]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        // vuelvo a tener 7 cartas
        this.players.getCartasById(1).cartas.length == 7
          ? console.log("OK")
          : console.log("FAIL");
    
        // Hay un penalidad de +2
        // Turno Jaq: (descarte +2 azul)
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        this.elJuego.penalidad === 2 ? console.log("OK") : console.log("FAIL");
        // juega un +2 rojo
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[3]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        this.players.getCartasById(2).cartas.length == 6
          ? console.log("OK")
          : console.log("FAIL");
    
        this.elJuego.penalidad === 4 ? console.log("OK") : console.log("FAIL");
        // Hay un penalidad de +4
        // Turno geo: (descarte +2 rojo)
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(3).player)
        );
        this.players.getCartasById(3).cartas.length == 11
          ? console.log("OK")
          : console.log("FAIL");
        this.elJuego.penalidad === 0 ? console.log("OK") : console.log("FAIL");
    
        // Hay un penalidad de 0
        // Turno fede: (descarte +2 rojo)
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[3]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //Descarto bloquear rojo (bloquea turno seba juega ara)
        // Turno ara
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //Descarta 1 rojo
    
        //juega Jaq
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        //Descarta giro rojo
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[3]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        //Cambia el orden juega Ara
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[5],
            "azul"
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //juega negro comodin, y selecciona azul
    
        //juega seba
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        // 5 azul
    
        //juega fede
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 9
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[2]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 7
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //amarillo 7
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[3]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 7
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[3]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 1
    
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //amarillo 1
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[4]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 1
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(2).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(2).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[3]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 2
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[4]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 2
    
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 9
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[3]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 7
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 0
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[2],
            "amarillo"
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //negro +4
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(0).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //Tengo que tener 9 cartas
        this.players.getCartasById(0).cartas.length == 10
          ? console.log("OK")
          : console.log("FAIL");
    
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[2]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //amarillo 7
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[5]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //amarillo girar
    
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(4).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(4).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //amarillo 0
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //amarillo 4
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[4]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 4
    
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[2]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 6
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 3
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 5
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(2).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(2).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[2],
            "verde"
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //comodin verde
    
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde 7 y se queda con una carta!
    
        salida = this.arbitrarJugada(
          this.decirUNO(this.players.getPlayerById(4).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.reportarJugadorConUnaCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(4).player
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.players.getCartasById(4).cartas.length == 1
          ? console.log("OK")
          : console.log("FAIL");
    
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde 5
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde bloquear, no dijo uno
    
        /*salida = this.arbitrarJugada(
          this.decirUNO(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");*/
    
        this.players.getCartasById(1).cartas.length == 1
          ? console.log("OK")
          : console.log("FAIL");
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[2]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        //verde 9
    
        salida = this.arbitrarJugada(
          this.reportarJugadorConUnaCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(1).player
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.players.getCartasById(1).cartas.length == 3
          ? console.log("OK")
          : console.log("FAIL");
    
        this.elJuego.turno === "fede" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(4).player,
            this.players.getPlayerById(4).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde 0 descarta y gano!
        this.ganadores.length == 1 ? console.log("OK") : console.log("FAIL")
        this.ganadores[0] == "fede" ? console.log("OK") : console.log("FAIL")
        this.players.jugadores.length == 4 ? console.log("OK") : console.log("FAIL")
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[5]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde 4
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde 1
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(2).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(2).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde bloquear
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde 1
        salida = this.arbitrarJugada(
          this.decirUNO(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(2).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(2).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[2]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //verde 3
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[5]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 3
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        this.players.getPlayerById(1).player.saidUno == false ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.decirUNO(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        this.players.getPlayerById(1).player.saidUno ? console.log("OK") : console.log("FAIL");
        //rojo 6
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 2
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(3).player)
        );
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[2]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 8
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 0
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(1).player)
        );
    
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[4]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 4
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(3).player)
        );
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[2],
            "rojo"
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //comodin rojo
    
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 8
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(1).player)
        );
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[3]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //rojo 6
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(3).player)
        );
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(3).player)
        );
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 6
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(1).player,
            this.players.getPlayerById(1).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        //azul +2
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(2).player)
        );
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[1]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //azul 8
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(0).player,
            this.players.getPlayerById(0).player.cartas[0],
            "amarillo"
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //+4 color amarillo
    
        this.elJuego.turno === "ara" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(1).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
        this.elJuego.turno === "jaq" ? console.log("OK") : console.log("FAIL");
    
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(2).player,
            this.players.getPlayerById(2).player.cartas[0]
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //amarillo 6
    
        this.elJuego.turno === "geo" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.levantarCartaDePila(this.players.getPlayerById(3).player)
        );
        salida = this.arbitrarJugada(
          this.descartarCarta(
            this.players.getPlayerById(3).player,
            this.players.getPlayerById(3).player.cartas[2],
            "amarillo"
          )
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
        //+4 color amarillo
    
        this.elJuego.turno === "seba" ? console.log("OK") : console.log("FAIL");
        salida = this.arbitrarJugada(
          this.pasarTurnoSinJugar(this.players.getPlayerById(0).player)
        );
        salida.penalizado == false ? console.log("OK") : console.log("FAIL");
    
    
        //console.log(this.players.getPlayerById(3).player.cartas)
    
      }

}


module.exports = Testeador;