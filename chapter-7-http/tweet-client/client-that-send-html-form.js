let http = require('http'),
	qs = require('querystring');

const send = (theName) => {
	http.request(
		{
			host: '127.0.0.1',
			port: 3000,
			url: '/',
			method: 'POST',
		},
		(res) => {
			res.setEncoding('utf8');
			res.on('end', () => {
				console.log('request complete');
				process.stdout.write('\n your name: ');
			});
		},
	).end(qs.stringify({ name: theName }));
};

process.stdout.write('\n your name: ');
process.stdin.resume();
process.stdin.setEncoding('utf-8');
process.stdin.on('data', (name) => {
	send(name.replace('\n', ''));
});
