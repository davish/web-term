/**
 * Created by davis on 3/24/15.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var child_process = require("child_process");

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
// TODO: make this an API
io.on('connection', function(socket){
  console.log('a user connected.');

  var term = child_process.spawn('bash');
  socket.emit('output', "Welcome! Your term has loaded, and you can begin to execute code.");
  term.stdout.on('data', function(data) {
    socket.emit('output', data.toString());
  });

  term.on('exit', function(code) {
    socket.emit('output', "term exited with code "+ code);
  });

  socket.on('command', function(c) {
    term.stdin.write(c + '\n');
  });

  socket.on('disconnect', function() {
    term.stdin.end();
  });
});

http.listen(3000, function() {
  console.log('listening on port 3000');
});