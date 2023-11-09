

const socketController = (socket) => {

    //socket.on('event', data => { /* … */ });

    console.log("cliente conectado");

    socket.on('disconnect', () => { 
        console.log("cliente desconectado");
    });
    socket.on('enviar-mensaje', (payload, callback) => {
        socket.broadcast.emit('enviar-mensaje',payload);
        const id = 123456;
        callback(id);

    });

    socket.on("Hello", (p) => {
        console.log(p)
    })
}

module.exports = {
    socketController
}