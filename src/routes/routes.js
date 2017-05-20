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
		var imageQueryStr = req.params.searchstr;
		var apiKey = req.app.locals.apikey;
		
		var baseApiUrl = 'https://pixabay.com/api/?key=';
		var apiRequestUrl = baseApiUrl + apiKey  + '&q=' + imageQueryStr;

		var resultHit;
		var resultHitArr = [];

		if(req.query.offset) {
			var resultsPage = req.query.offset;
			apiRequestUrl += '&page=' + resultsPage;
		}

		https.get(apiRequestUrl, function(result) {
			var body = '';

			result.on('data', function(data) {
				body += data;
			});

			result.on('end', function() {
				var imageApiResult = JSON.parse(body);

				console.log("Length: " + imageApiResult.hits.length);
				for(var i=0; i < imageApiResult.hits.length; i++) {
					resultHit = {
						"imageURL": imageApiResult.hits[i].userImageURL,
						"imagePreviewURL": imageApiResult.hits[i].previewURL,
						"imageDescriptionTags": imageApiResult.hits[i].tags
					};

					resultHitArr.push(resultHit);
				}

				res.send(resultHitArr);
			});
		});
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};