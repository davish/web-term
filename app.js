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

io.on('connection', function(socket){
  console.log('a user connected.');

  var term = child_process.spawn('bash');

  term.stdout.on('data', function(data) {
    console.log(data.toString());
    socket.emit('output', data.toString());
  });

  term.on('exit', function(code) {
    socket.emit('output', "term exited with code "+ code);
    socket.end();
  });

  socket.on('command', function(c) {
    console.log('command: '+c);
    term.stdin.write(c + '\n');
  });

  socket.on('disconnect', function() {
    term.stdin.end();
  });
});

http.listen(3000, function() {
  console.log('listening on port 3000');
});