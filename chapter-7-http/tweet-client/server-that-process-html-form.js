let qs = require('querystring');

require('http')
	.createServer((req, res) => {
		let body = '';

		req.on('data', (chunk) => {
			body += chunk;
		});

		req.on('end', () => {
			res.writeHead(200);
			res.end('Done');

			console.log(`got name ${qs.parse(body).name} \n`);
		});
	})
	.listen(3000);
