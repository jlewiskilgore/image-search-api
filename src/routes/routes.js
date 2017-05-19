var https = require('https');

module.exports = function(app, env) {
	app.get('/', function(req, res) {
		res.send(
			'<h1>Image Search API</h1>' +
			'<br>' +
			'<br>' +
			'To search for image data use:' +
			'<br>' +
			'<br>' +
			'<code>appurl/imagesearch/[search query]</code>' +
			'<br>' +
			'<br>' +
			'Can also use the option URL parameter "?offset=x" to paginate search results' +
			'<br>' +
			'<br>' +
			'<br>' +
			'<br>' +
			'To view the last 10 search strings use:' +
			'<br>' +
			'<br>' +
			'<code>appurl/latest/imagesearch/</code>' +
			'<br>' +
			'<br>'
		);
	});

	app.get('/latest/imagesearch', function(req, res) {
		res.send(
			'Last 10 image search strings...'
		);
	});

	app.get('/imagesearch/:searchstr(*)', function(req, res) {
		console.log(req.params.searchstr);

		var imageQueryStr = req.params.searchstr;
		var apiKey = req.app.locals.apikey;
		
		var baseApiUrl = 'https://pixabay.com/api/?key=';
		var apiRequestUrl = baseApiUrl + apiKey  + '&q=' + imageQueryStr;

		if(req.query.offset) {
			var resultsPage = req.query.offset;
			apiRequestUrl += '&page=' + resultsPage;
		}

		console.log(apiRequestUrl);

		https.get(apiRequestUrl, function(result) {
			var body = '';

			result.on('data', function(data) {
				body += data;
			});

			result.on('end', function() {
				var imageApiResult = JSON.parse(body);
				res.send(imageApiResult);
			});
		});
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};