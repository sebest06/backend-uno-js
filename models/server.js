const express = require('express');
const cors = require('cors');
const { socketController } = require('../sockets/controller');
const {Sesiones} = require('./sesiones');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server,{
            cors: {
                origin: "*"
              }
        });

        this.sesiones = new Sesiones()

        // Middlewares
        this.middlewares();

        //config sockets
        this.sockets();
        
    }

    sockets () {
        this.io.on('connection', (id) => socketController(id, this.sesiones));
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
