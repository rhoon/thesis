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
    // fs.writeFile('data/pages-out.json', JSON.stringify(pages), function(err) {
    //     if (err) {throw err;}
    // });
//     console.log(pages);
// });


var page = new Object;
page.url ='Dada'; //url

var url = 'https://en.wikipedia.org/wiki/'+page.url;
var mapsFromURL = 'https://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/'+page.url+'&limit=3000';

// this has to happen later in the order
function wDScrape(pg) {
  request(pg.wikiData, function(err, resp, body) {
     if (err) {throw err;}
      console.log('scraping wikiData '+pg.wikiData);
      pg.metaData = dataScrape.scrape(body);
  });
}


// collect links pointing outwards from the page
request(url, function(err, resp, body) {
   if (err) {throw err;}
    console.log('scraping mainPage '+url);
    var s = mT.scrape(body, url);
   //  console.log(s);
    page.mapsTo = s.mapsTo;
    page.wikiData = s.wikiData;

    // collect wikiData (categorical info)
    wDScrape(page);

    // collect links pointing at this page
    request(mapsFromURL, function(err, resp, body) {
      if (err) {throw err;}
        console.log('scraping mapsFrom '+mapsFromURL);
        page.mapsFrom = mF.scrape(body);
       //  console.log(page.mapsFrom);

       pages.push(page);

       fs.writeFile('data/pages-out.json', JSON.stringify(pages), function(err) {
           if (err) {throw err;}
           console.log('file written');
       });

    });

});

// var i = 1;

// function myLoop () {           //  create a loop function
//    setTimeout(function () {    //  call a 3s setTimeout when the loop is called
//
//      //recursive loop call (this actually happens before anything else does in the loop)
//     i++;
//     if (i < 3) {
//
//          console.log(pages);
//          myLoop();
//     }
//   }, 3000)
// }
//
// myLoop();
