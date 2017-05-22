var https = require('https');
var async = require('async');

module.exports = function(app, env) {
	app.get('/', function(req, res) {
		res.send(
			'<h1>Image Search API</h1>' +
			'<br>' +
			'<br>' +
			'To search for image data use:' +
			'<br>' +
			'<br>' +
			'<code>https://thawing-atoll-20447.herokuapp.com/imagesearch/[search query]</code>' +
			'<br>' +
			'<br>' +
			'Can also use the option URL parameter "?offset=x" to paginate search results:' +
			'<br>' +
			'<br>' +
			'<code>https://thawing-atoll-20447.herokuapp.com/imagesearch/[search query]?offset=2</code>' +
			'<br>' +
			'<br>' +
			'This will return a JSON response where each element is a struct containing the following: ' +
			'<br>' +
			'<ul>imageURL - URL to the full image</ul>' +
			'<ul>imagePreviewURL - URL to the preview image</ul>' +
			'<ul>imageDescriptionTags - Tags that describe the image</ul>' +
			'<br>' +
			'<br>' +
			'To view the history of the last 10 search strings use:' +
			'<br>' +
			'<br>' +
			'<code>https://thawing-atoll-20447.herokuapp.com/latest/imagesearch/</code>' +
			'<br>' +
			'<br>'
		);
	});

	app.get('/latest/imagesearch', function(req, res) {
		var db = req.db;
		var searchHistory = db.collection('searchHistory');

		searchHistory.find().sort({'searchDate':-1}).limit(10).toArray(function(error, result) {
			var latestHistory = [];
			var search;
			
			for(var i=0; i<result.length; i++) {
				search = {
					"searchDate": result[i].searchDate,
					"searchString": result[i].searchString
				};

				latestHistory.push(search);
			}

			res.send(latestHistory);
		});
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

				saveSearchHistory(req);
				res.send(resultHitArr);
			});
		});
	});

	app.get('*', function(req, res) {
		res.redirect('/');
	});
};

function saveSearchHistory(req) {
	console.log("saving history...");
	var db = req.db;
	var searchHistory = db.collection('searchHistory');

	var currDate = new Date();
	var searchStr = req.params.searchstr;

	var search = {
		"searchDate": currDate,
		"searchString": searchStr
	};

	searchHistory.insert(search, function(err, res) {
		if(err) {
			throw err;
		}
		console.log("Search Saved!");
	});

	console.log(currDate);
	console.log(searchStr);
};