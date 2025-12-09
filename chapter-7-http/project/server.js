let qs = require('querystring');

require('http')
	.createServer((req, res) => {
		if ('/' == req.url) {
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.end(
				[
					'<form method="POST" action="/url">',

					'<h1>My Form</h1>',
					'<fieldset>',
					'<label>Personal information</label>',
					'<p>What is your name?</p>',
					'<input type="text" name="name" >',
					'<p><button>Submit</button></p>',
					'</fieldset>',
					'</form>',
				].join(''),
			);
		} else if (req.url == '/url' && 'POST' == req.method) {
			let body = '';

			req.on('data', (chunk) => {
				body += chunk;
			});

			req.on('end', () => {
				res.writeHead(200, { 'content-type': 'text/html' });

				res.end(`<p>Your name is <b> ${qs.parse(body).name} </b></p>`);
			});
		} else {
			res.writeHead(404);
			res.end(`<p>Not Found!</p>`);
		}
	})
	.listen(3000);
