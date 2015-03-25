/**
 * Created by davis on 3/24/15.
 */

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var spawn = require("child_process").spawn;
var exec = require("child_process").exec;

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});
// TODO: make this an API
io.on('connection', function(socket){
  console.log('a user connected.');

  var term = null;

  socket.on('new instance', function(params) {
    if (term)
      term.kill('SIGINT');
    var filename = params.name;
    if (filename.indexOf('.java') < 0)
      filename = filename + '.java';
    exec('javac -d compiled/ ' + filename, {cwd: __dirname + '/javafiles'}, function(error, stdout, stderr) {
      /*
       * stderr has the error string.
       * error.code
       *  1 if there's syntax errors.
       *  2 if file not found.
       * error = null if there's no error
       */
      if (error) {
        socket.emit('output-err', stderr.toString());
      } else {
        term = spawn('java', [params.name], {cwd: __dirname + '/javafiles/compiled'});

        term.stdout.on('data', function(data) {
          socket.emit('output', data.toString());
        });

        term.stderr.on('data', function(data) {
          socket.emit('output-err', data.toString());
        });

        term.on('exit', function(code) {
          socket.emit('output', "term exited with code "+ code);
        });

        socket.on('ctrl-c', function() {
          term.kill('SIGINT');
        });

        socket.on('command', function(c) {
          term.stdin.write(c + '\n');
        });

        socket.on('disconnect', function() {
          console.log('a user disconnected.');
          term.kill('SIGINT');
        });
        socket.emit('output', "Your program is ready. Type away!");
      }
    });
  });
});

http.listen(3000, function() {
  console.log('listening on port 3000');
});