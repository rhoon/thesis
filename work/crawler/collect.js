//collect.js gets gets pages and runs them through the data pipeline

var request = require('request');
var fs = require('fs');

var mp = require('./s-mainPage');
//load object

//concatenate mapsTo and mapsFrom; remove dups

// async loop through mapsTo and mapsFrom properties

//load url
url = 'https://en.wikipedia.org/wiki/Dada';

// var aa = setTimeout(function () {  return(page);  }, time());

// //generate random time in milliseconds between 30 and 90 seconds
// function time() {
//   return Math.random() * (60000) + 30000;
// }

// grab the page
request(url, function(err, resp, body) {
   if (err) {throw err;}
    console.log(mp.scrape(body, url));
});

//write the data file
