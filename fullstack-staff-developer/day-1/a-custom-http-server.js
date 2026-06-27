const http = require('node:http');

const server = http.createServer((req, res) => {
	res.end('server listening');
});

server.on('clientError', (err, socket) => {
	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

server.listen(5000);
