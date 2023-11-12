const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { socketController } = require('../sockets/controller');

const { dbConnection } = require('../database/config');
//const Game = require('./game');
const Testeador = require('../test/tester');
const {Sesiones} = require('./sesiones');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server,{
            cors: {
                origin: "http://localhost:5173"
              }
        });

        this.sesiones = new Sesiones()

        //this.uno_game = new Game([{nombre: "seba"},{nombre: "ara"},{nombre: "jaq"},{nombre: "geo"},{nombre: "fede"}],0,true);
        //this.test_uno_game = new Testeador()

        this.paths = {
            auth:       '/api/auth',
            buscar:     '/api/buscar',
            categorias: '/api/categorias',
            productos:  '/api/productos',
            usuarios:   '/api/usuarios',
            uploads:    '/api/uploads',
        }


        // Conectar a base de datos
        //this.conectarDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        //config sockets
        this.sockets();
        
    }

    sockets () {
        this.io.on('connection', (id) => socketController(id, this.sesiones));
    }

    async conectarDB() {
        await dbConnection();
    }


    middlewares() {

        // CORS
        this.app.use( cors() );

        // Lectura y parseo del body
        this.app.use( express.json() );

        // Directorio Público
        this.app.use( express.static('public') );

        // Fileupload - Carga de archivos
        this.app.use( fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));

    }

    routes() {
        
        this.app.use( this.paths.auth, require('../routes/auth'));
        this.app.use( this.paths.buscar, require('../routes/buscar'));
        this.app.use( this.paths.categorias, require('../routes/categorias'));
        this.app.use( this.paths.productos, require('../routes/productos'));
        this.app.use( this.paths.usuarios, require('../routes/usuarios'));
        this.app.use( this.paths.uploads, require('../routes/uploads'));
        
    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;
