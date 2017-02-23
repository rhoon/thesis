//collect.js gets gets pages and runs them through the data pipeline

//  Output data structure:
///    this page's URL                  url        str
///    links from this page             mapsTo     []
///    pages linking to this one        mapsFrom   []
///    metaData from wiki's data page   metaData   {}

var request = require('request');
var fs = require('fs');

//local modules
var dataScrape = require('./s-wikiData');
var mF = require('./s-mapsFrom');
var mT = require('./s-mainPage');


var page = new Object;
page.mapsTo = [];
page.url = 'Dada'; //url

var url = 'https://en.wikipedia.org/wiki/'+page.url;
var mapsFromURL = 'https://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/'+page.url+'&limit=3000';

// grab the page
request(url, function(err, resp, body) {
   if (err) {throw err;}
    page.mapsTo = mT.scrape(body, url);
    console.log(mT.scrape(body, url))
});

request(mapsFromURL, function(err, resp, body) {
  if (err) {throw err;}
    console.log('scraping '+mapsFromURL);
    page.mapsFrom = mF.scrape(body);
    console.log(mF.scrape(body));
})

// request(wikiData, function(err, resp, body) {
//    if (err) {throw err;}
//     console.log('scraping '+wikiData);
//     page.metaData = dataScrape.scrape(body);
// });

//write the data file
