//collect.js gets gets pages and runs them through the data pipeline

//  Output data structure:
///    this page's URL                  url        str
///    links from this page             mapsTo     []
///    pages linking to this one        mapsFrom   []
///    metaData from wiki's data page   metaData   {}

// Will need to ID 'influencers' - things that bear an outsize influence on all events of time, such as WWI, and catalogue them
// appropriately / define them as stopping points to keep thesis centered around Dada

var request = require('request');
var fs = require('fs');
var async = require('async');

//local modules
var dataScrape = require('./s-wikiData');
var mF = require('./s-mapsFrom');
var mT = require('./s-mainPage');

var pagesIn = JSON.parse(fs.readFileSync('data/pages.json'));
var pages = [];

var endLoop = pagesIn.mapsTo.length-1;

var exceptions = [
  'wikisource.org',
  '.jpg',
  '.png',
  '.gif',
]

var fullSkip = [
  'wikipedia', // foriegn pages
  'wiktionary.org', // no wiktionary pages
  'wikiquote' // no wikiquote pages
]

// check for exceptions
function skip(link, exc) {
  for (var c in exc) {
    if (link.includes(exc[c])) {
      return true;
      // console.log('skipping');
      break;
    }
  }
}

function getRando(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function writeDataFile(counter) {
  counter++;
  if (counter>=endLoop) { //if last loop, write the file /
    fs.writeFile('data/pages-out.json', JSON.stringify(pages), function(err) {
        if (err) {throw err;}
        console.log('file written');
    });
  }
}

//recursive loop for setTimeout
var i = 0;

function crawler () {           //  create a loop function
   setTimeout(function () {    //  call a 3s setTimeout when the loop is called


        var page = new Object;
        page.url = pagesIn.mapsTo[i]; //url

        //this scraper only handles english and is not equipped for non-english pages
        var url = 'https://en.wikipedia.org/wiki/'+page.url;
        var mapsFromURL = 'https://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/'+page.url+'&limit=3000';

        //check for foriegn pages
        if (!skip(page.url, fullSkip)) {

        // collect links pointing at this page
        request(mapsFromURL, function(err, resp, body) {
          if (err) {throw err;}
            console.log('scraping mapsFrom '+mapsFromURL);
            page.mapsFrom = mF.scrape(body);
           //  console.log(page.mapsFrom);

           if (!skip(page.url, exceptions)) {

            // collect links pointing outwards from the page
            request(url, function(err, resp, body) {
               if (err) {throw err;}
                console.log('scraping mainPage '+url);
                var s = mT.scrape(body, url);
               //  console.log(s);
                page.mapsTo = s.mapsTo;
                page.wikiData = s.wikiData;

               // collect wikiData (categorical info)
               request(page.wikiData, function(err, resp, body) {
                  if (err) {throw err;}
                   console.log('scraping wikiData '+page.wikiData);
                   page.metaData = dataScrape.scrape(body);
                   pages.push(page);
                   writeDataFile(i);

               }); // end wikiData request

            }); // end mainPage request

          } else {
            // some urls lead to direct sources, like images and manifesto, that do not have 'mainPage' or 'wikiData' items
            // so just push the page as is
            pages.push(page);
            writeDataFile(i);
          }

        });

      } else {
        page.noScrape = 1;
        pages.push(page);
        console.log('---------------------NO SCRAPE---------------------');
        writeDataFile(i);
      } // end fullSkip conditional

    //update count and check for end case
    i++;
    if (i < endLoop) { //pagesIn.mapsTo.length-1
         console.log(i+' of '+ endLoop);
         crawler();
    }

    //set delay to a random interval between 500 and 3000 milliseconds
  }, getRando(500,3000))
}
//
crawler();
