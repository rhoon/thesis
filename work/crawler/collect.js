//collect.js gets gets pages and runs them through the data pipeline

var request = require('request');
var fs = require('fs');

var mp = require('./s-mainPage');
//load object

//concatenate mapsTo and mapsFrom; remove dups

// async loop through mapsTo and mapsFrom properties

//load url
url = 'https://en.wikipedia.org/wiki/Dada';

// grab the page
request(url, function(err, resp, body) {
   if (err) {throw err;}
    console.log(mp.scrape(body, url));
});

//write the data file
