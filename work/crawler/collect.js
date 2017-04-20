//collect.js gets gets pages and runs them through the data pipeline

//  Output data structure:
///    this page's URL                  url        str
///    links from this page             mapsTo     []
///    pages linking to this one        mapsFrom   []
///    metaData from wiki's data page   metaData   {}
///    if object should not be scraped  noscrape   binary (either has attr or does not have it)

// Will need to ID 'influencers' - things that bear an outsize influence on all events of time, such as WWI, and catalogue them
// appropriately / define them as stopping points to keep thesis centered around Dada

// RUN NOTES:
// Wikipedia appears to block IP at some point (unclear what the cutoff is)

var request = require('request');
var fs = require('fs');
var async = require('async');

//local modules
var dataScrape = require('./s-wikiData');
var mF = require('./s-mapsFrom');
var mT = require('./s-mainPage');

var pagesIn = JSON.parse(fs.readFileSync('pages.json'));
var pages = [];

var endLoop = pagesIn.mapsTo.length-1;

var exceptions = [
  'wikisource.org',
  '.jpg',
  '.png',
  '.gif',
  'Book:'
]

var fullSkip = [
  'wikipedia', // no foriegn pages (not in scope)
  'wiktionary.org', // no wiktionary pages
  'wikiquote', // no wikiquote pages
  '_talk:', // no talk pages
  'Draft:'
]


 // Empty Array that is filled with already-scraped items
 // to avoid potentially scraping the same page twice
var dups = [];

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

//store the last batch saved
var lastBatch = 2;

function writeDataFile(counter) {
  counter++;
  if (counter>=endLoop || counter%250==0) { //if last loop or if counter is divisible by 250, write the file
    fs.writeFile('data/mapsTo-r2-batch'+lastBatch+'.json', JSON.stringify(pages), function(err) {
        if (err) {throw err;}
        console.log('file written');
        lastBatch++;
        // clear pages to make room in memory
        pages = [];
    });
  }
}

//recursive loop for setTimeout
var i = 0;

function crawler () {           //  create a loop function
   setTimeout(function () {    //  call a 3s setTimeout when the loop is called

        // check for already scraped urls
        if(!skip(pagesIn.mapsTo[i], dups)) {

          var page = new Object;
          page.root = pagesIn.url; // will need to modify this for next batch?
          page.url = pagesIn.mapsTo[i]; //url //'Dada';
          //track already scraped pages
          dups.push(page.url);

          //this scraper only handles english and is not equipped for non-english pages
          var url = 'https://en.wikipedia.org/wiki/'+page.url;
          var mapsFromURL = 'https://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/'+page.url+'&limit=3000';

          //check for fullSkip (pages not scraping) pages
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
                  page.image = s.image;
                  page.title = s.title;

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

      } // end dups conditional

    //update count and check for end case
    i++;
    if (i < endLoop) { //pagesIn.mapsTo.length-1
         console.log(i+' of '+ endLoop);
         crawler();
    }

    //set delay between 1200 and 3600 milliseconds per request
  }, getRando(1200,3600))

}
//
crawler();
