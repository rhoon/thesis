//collect.js gets gets pages and runs them through the data pipeline

//  Output data structure:
///    this page's URL                  url        str
///    links from this page             mapsTo     []
///    pages linking to this one        mapsFrom   []
///    metaData from wiki's data page   metaData   {}


// Will need to ID 'influencers' - things that bear an outsize influence on all events of time, such as WWI, and catalogue them
// appropriately / define them as stopping points to keep thesis centered around Dada

//Daniel's feedback here regarding async: can be run as seperate programs
var request = require('request');
var fs = require('fs');
var async = require('async');

//local modules
var dataScrape = require('./s-wikiData');
var mF = require('./s-mapsFrom');
var mT = require('./s-mainPage');

var pagesIn = JSON.parse(fs.readFileSync('data/pages.json'));
var pages = [];

//testing scaling
// async.reduce([1,2,3], 0, function(memo, item, callback) {
//     // pointless async:
//     process.nextTick(function() {
//         getPage(pagesIn.mapsTo[memo]);
//         callback(null, memo + item)
//     });
// }, function(err, result) {
//     //write the data file
//     fs.writeFile('data/pages-out.json', JSON.stringify(pages), function(err) {
//         if (err) {throw err;}
//     });
//     console.log(pages);
// });

function getPage(abbrvURL) {

  var page = new Object;
  page.url ='Dada'; //url

  var url = 'https://en.wikipedia.org/wiki/'+page.url;
  var mapsFromURL = 'https://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/'+page.url+'&limit=3000';

  // grab the page - this has to happen early in the order
  request(url, function(err, resp, body) {
     if (err) {throw err;}
      console.log('scraping mainPage '+url);
      var s = mT.scrape(body, url);
      page.mapsTo = s.mapsTo;
      page.wikiData = s.wikiData;
      wDScrape();
  });

  // this can happen any time in the order
  request(mapsFromURL, function(err, resp, body) {
    if (err) {throw err;}
      console.log('scraping mapsFrom '+mapsFromURL);
      page.mapsFrom = mF.scrape(body);
  })

  // this has to happen later in the order
  function wDScrape() {
    request(page.wikiData, function(err, resp, body) {
       if (err) {throw err;}
        console.log('scraping wikiData '+page.wikiData);
        page.metaData = dataScrape.scrape(body);
    });
  }

  //this has to happen last (hoping to use setTimeout as a dual purpose: delay the page requests and push a complete object...)
  setTimeout(function() {
    // console.log(page);
    pages.push(page);
  }, 10000);

}
