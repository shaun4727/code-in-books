let qs = require('querystring'),
	http = require('http');

let search = process.argv.slice(2).join(' ').trim();

if (!search.length) {
	return console.log('Usage: node tweets search term\n');
}

console.log(`\n searching for: ${search}`);

http.get(
	{
		host: 'search.twitter.com',
		path: `/search.json?${qs.stringify({ q: search })}`,
	},
	(res) => {
		let body = '';
		res.setEncoding('utf8');
		res.on('data', (chunk) => {
			body += chunk;
		});

		res.on('end', () => {
			let obj = JSON.parse(body);
			obj.results.forEach((tweet) => {
				console.log(`${tweet.text}\n`);
				console.log(`${tweet.from_user}\n`);
			});
		});
	},
).end();
