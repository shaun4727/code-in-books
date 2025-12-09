require('http')
	.request(
		{
			host: '127.0.0.1',
			port: 3000,
			url: '/',
			method: 'GET',
		},
		(res) => {
			let body = '';
			res.setEncoding('utf8');
			res.on('data', (chunk) => {
				body += chunk;
			});

			res.on('end', () => {
				console.log(`We got ${body}`);
			});
		},
	)
	.end();
