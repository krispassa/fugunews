var Observable = require('FuseJS/Observable');
var news = Observable();
var currentNew = Observable();
var moreTimer;
var isLoading = Observable(false);

var url = 'https://content.guardianapis.com/search?';
var page = 1;
var params = [{
	name: 'page-size',
	value: 10
},{
	name: 'show-fields',
	value: 'trailText,thumbnail'
},{
	name: 'api-key',
	value: 'INSERT YOUR GUARDIAN API KEY HERE'
}];

function buildUrl(page) {
	var requestUrl = url + 'page=' + page;

	for (var i = 0, j = params.length; i < j; i++) {
		requestUrl += '&';
		requestUrl += params[i].name;
		requestUrl += '=';
		requestUrl += params[i].value;
	}

	return requestUrl;
}

function loadNews(page, callback) {
	fetch(buildUrl(page), {
		method: 'GET',
		headers: { 'Content-type': 'application/json' }
	}).then(function(response) {
		return response.json();
	}).then(function(responseObject) {
		var results = responseObject.response.results;

		if (page === 1) {
			news.clear();
		}

		for (var i = 0, j = results.length; i < j; i++) {
			results[i].body = stripHTML(results[i].fields.trailText);
			results[i].image = 'https://unsplash.it/500/25' + i + '/?random';
			news.add(results[i]);
		}

		if (typeof callback == 'function') callback();
	});

	function stripHTML(text) {
		return text.replace(/<.*?>/gm, '');
	}
}

loadNews(1);

function showDetails(arg) {
	currentNew.value = arg.data;

	router.push("details");
}

function goHome() {
	router.goBack();
}

function loadMore() {
	page++;
	clearTimeout(moreTimer);
	moreTimer = setTimeout(function() {
		loadNews(page);
	}, 500);
}

function reloadHandler() {
	isLoading.value = true;
	page = 1;
	loadNews(page, endLoading);
}

function endLoading() {
	isLoading.value = false;
}

module.exports = { news, loadNews, loadMore, currentNew, showDetails, goHome, isLoading, reloadHandler };
