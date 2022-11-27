'use strict'

//////EXPRESS////////
const express = require('express');
const app = express();
const fs =require("fs");


////////HTTP/////////
const http = require('http').createServer(app);

//Port and server setup
const port = process.env.PORT || 1989;

//Server
const server = app.listen(port);

//Console the port
console.log('Server is running localhost on port: ' + port );

/////SOCKET.IO///////
const io = require('socket.io').listen(server);

////////EJS//////////
const ejs = require('ejs');

//Setup the views folder
app.set("views", __dirname + '/views');

//Setup ejs, so I can write HTML(:
app.engine('.html', ejs.__express);
app.set('view-engine', 'html');

//Setup the public client folder
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));

//Client view
app.get('/', (req, res) => {
 
  res.render('index.html');
	//res.render('index.html');

});

//404 view
app.get('/*', (req, res) => {

	//res.render('404.html');
//  res.render('index2.html');
 //res.render('./index.html');
 res.render('index.html')

});

app.get('/index', (req, res) => {
 
	//res.render('404.html');
  res.render('index2.html');
 //res.render('./index.html');
 //res.render('index.html')

});

app.get('index6', (req, res) => {
  res.render('index6.html');
	//res.render('index.html');

});

app.get('index8', (req, res) => {
 
  res.render('index8.html');
	//res.render('index.html');

});

let clients = {}

//Socket setup
io.on('connection', client=>{


  var a=Math.random()*20;
  var b=Math.random()*20;
  var c=Math.random()*20;


  console.log('User ' + client.id + ' connected, there are ' + io.engine.clientsCount + ' clients connected');
  console.log('User ' + client.id + ' connected, new there are ' + io.engine.clientsCount + ' clients connected');

  //Add a new client indexed by his id
  clients[client.id] = {
  ///  position: [0, 0, 0],
    //rotation: [0, 0, 0]
      position: [a, -0.4, b],
    rotation: [a, c, b]
    
  }


  //클라이언트에게 보냄.
  //Make sure to send the client it's ID
  client.emit('introduction', client.id, io.engine.clientsCount, Object.keys(clients));

  //Update everyone that the number of users has changed
  io.sockets.emit('newUserConnected', io.engine.clientsCount, client.id, Object.keys(clients));

  client.on('move', (pos)=>{

   
                        
var list = document.getElementById("list");
list.innerHTML = htmlStr;


   

    clients[client.id].position = pos;
    io.sockets.emit('userPositions', clients);
    console.log("move")



  });

  //Handle the disconnection
  client.on('disconnect', ()=>{

    //Delete this client from the object
    delete clients[client.id];

    io.sockets.emit('userDisconnected', io.engine.clientsCount, client.id, Object.keys(clients));
    console.log("disconnect")

    console.log('User ' + client.id + ' dissconeted, there are ' + io.engine.clientsCount + ' clients connected');

  });




});



