const express = require("express");
const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


app.use(express.json());
app.use(express.urlencoded({extended:true}));

http.listen(8080, () => {
    console.log('Servidor en puerto 8080');
})

///////////////////

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("./public"));

///////////////////

app.set("views", "./views");
app.set("view engine", "ejs");

///////////////////

// Lista de productos
const productos = [
    {
        id: 1,
        title: 'Neymar',
        price: 165,
        thumbnail: 'neymar.jpg'
    }
]; 

// Lista de mensajes

const messages = [
    {
        email: 'cristian.svk@gmail.com',
        timestamp: '09/09/2021 12:00:00',
        message: 'Hola!'
    }
]

// Rutas

app.get('/', (req, res) => {
    res.render('pages/index', {productos: productos})
})

io.on('connection', (socket) => {
    socket.broadcast.emit('mensaje', 'Hola mundo');
    socket.emit('products', productos);
    socket.emit('messages', messages);

    socket.on('new-product', function(data){
        let myID = (productos.length)+1;

        let myTitle = data.title;
        let myPrice = data.price;
        let myThumbnail = data.thumbnail;

        const producto = {
            id: myID, 
            title: myTitle, 
            price: myPrice, 
            thumbnail: myThumbnail
        }

        productos.push(producto);

        io.sockets.emit('products', productos);
    })

    socket.on('new-message', function(data) {
        messages.push(data);
        io.sockets.emit('messages', messages);
    });

})
