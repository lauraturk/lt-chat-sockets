var app = require('express')();
var http = require('http').Server(app);
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

const users = [];

io.on('connection', function(socket){
  io.emit('new', { for: 'everyone', message: `Welcome Newb! Tell us your name!`})


  socket.on('chat message', function(msg, socket) {
    io.emit('chat message', msg, socket);
  });

  socket.on('setUsername', function(data) {
    if(users.indexOf(data) === -1){
      users.push(data)
      io.emit('setUserGroup', {usergroup: users})
      socket.emit('userSet', { username: data });
    } else {
      socket.emit('userExists', data + ' username already exists. Try a new one!');
    }
  });

  socket.on('typing message', function() {
    socket.broadcast.emit('typing')
  })



  socket.on('disconnect', function(){
    socket.broadcast.emit('new', { message: 'Adios Amigo!'});
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
