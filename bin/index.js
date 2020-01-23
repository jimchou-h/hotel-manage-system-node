var app = require('../app');
var http = require('http');

var port = getPort(process.env.PORT || '8000');
app.set('port', port);

var server = http.createServer(app);

server.listen(port);

function getPort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}