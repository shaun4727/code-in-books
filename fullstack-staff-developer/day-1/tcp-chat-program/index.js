const net = require('node:net');

let count = 0,
	user = {},
	nickname = '';

const server = net
	.createServer((socket) => {
		console.log('new connection!');
		// this ensures you will get string instead of buffer
		socket.setEncoding('utf8');
		socket.write(
			'welcome to chat server!\n' +
				'Please write your name and press enter\n' +
				count +
				' People connected to the server\n',
		);
		socket.on('end', () => {
			for (let i in user) {
				user[i].write(nickname + ' left the room!\n');
			}
		});
		count++;

		socket.on('data', (data) => {
			// it consoles buffer data on the server
			nickname = data.replace('\r\n', '');
			if (user[nickname]) {
				socket.write('User already exists. Please try again!\n');
			} else {
				user[nickname] = socket;

				for (let i in user) {
					user[i].write(nickname + ' joined the room!\n');
				}
			}
		});
		socket.on('close', () => {
			count--;
			console.log('connection closed!');
		});
	})
	.on('error', (err) => {
		throw err;
	});

server.listen(
	{
		host: 'localhost',
		port: 8000,
		exclusive: true,
	},
	() => {
		console.log('opened server on', server.address());
	},
);
