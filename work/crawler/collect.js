//collect.js gets gets pages and runs them through the data pipeline

//  Output schema:
///    this page's URL                  url        str
///---->    the next closest root to Dada    url        [] (handle case dup)
///    the page's title                 words      str
///    the page's image, if it has one  url        str
///    links from this page             mapsTo     []
///    pages linking to this one        mapsFrom   []
///    metaData from wiki's data page   metaData   {}

var request = require('request');
var fs = require('fs');
var async = require('async');

//local modules
var dataScrape = require('./s-wikiData');
var mF = require('./s-mapsFrom');
var mT = require('./s-mainPage');
var detect = require('./s-detect');

//data
var pagesIn = JSON.parse(fs.readFileSync('Dada-update0.json'));
var pages = [];

// test URLs - 'Francis_Picabia' - 'Ann%C3%A9es_folles' - 'Dada'

var pgI = 0,                        // pagesIn[pgI] counter
    urlArr = pagesIn[pgI].mapsFrom, // array of urls to scrape (this will be a parameter)
    i = 0,                          // loop start
    endLoop = urlArr.length-1,      // loop endPoint
    lastBatch = 0,                  //initialize lastBatch
    var dups = [];                  // track already scraped pages to avoid dups

var exceptions = [
  'wikisource.org',
  '.jpg',
  '.png',
  '.gif',
  'Book:'
]

var fullSkip = [
  'wikipedia',      // no foriegn pages (not in scope)
  'wiktionary.org', // no wiktionary pages
  'wikiquote',      // no wikiquote pages
  '_talk:',         // no talk pages
  'Draft:'
]

// check for exceptions
function skip(link, exc) {
  var fact = false;
  for (var c in exc) {
    if (link.includes(exc[c])) {
      fact = true;
      break;
    }
  }
  return fact;
}

// check for matches
function skipMatch(link, exc) {
  var fact = false;
  for (var c in exc) {
    if (link===exc[c]) {
      fact = true;
      console.log('COLLECT CAUGHT DUP: '+link);
      break;
    }
  }
  return fact;
}

function getRando(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function writeDataFile(counter) {
  counter++;
  if (counter>=endLoop || counter%250==0) { //if last loop or if counter is divisible by 250, write the file
    fs.writeFile('data/MapsFrom-update'+lastBatch+'-'+counter+'.json', JSON.stringify(pages), function(err) {
        if (err) {throw err;}
        console.log('file written');
        lastBatch=counter;
        pages = [];
    });
  }
}

function crawler () {           //  create a loop function
   setTimeout(function () {    //  call a 3s setTimeout when the loop is called

        // check for already scraped urls
        if(!skipMatch(pagesIn[pgI].mapsTo[i], dups)) {

          var page = new Object;
          page.distance = 1;
          page.root = pagesIn[pgI].url; // will need to modify this for next batch?
          page.url =  urlArr[i];        // testURL_1;
          dups.push(page.url);

          var url = 'https://en.wikipedia.org/wiki/'+page.url;
          var mapsFromURL = 'https://en.wikipedia.org/w/index.php?title=Special:WhatLinksHere/'+page.url+'&limit=3000';

          //check for fullSkip (pages not scraping) pages
          if (!skip(page.url, fullSkip)) {

          // collect links pointing at this page
          request(mapsFromURL, function(err, resp, body) {
            if (err) {throw err;}
              console.log('scraping mapsFrom '+mapsFromURL);
              page.mapsFrom = mF.scrape(body);
             if (!skip(page.url, exceptions)) {

              // collect links pointing outwards from the page
              request(url, function(err, resp, body) {
                 if (err) {throw err;}
                  console.log('scraping mainPage '+url);
                  var s = mT.scrape(body, url);
                  page.mapsTo = s.mapsTo;
                  page.wikiData = s.wikiData;
                  page.image = s.image;
                  page.title = s.title;

                 if (page.wikiData!=undefined) {
                   // collect wikiData (categorical info)
                   request(page.wikiData, function(err, resp, body) {
                      if (err) {throw err;}
                       console.log('scraping wikiData '+page.wikiData);
                       page.metaData = dataScrape.scrape(body);
                       pages.push(page);
                       writeDataFile(i);
                   });
                 } else {
                   // case no wikiData
                   page.metaData = null;
                   pages.push(page);
                   writeDataFile(i);
                 }
              }); // end mainPage request
            } else {
              // some page types don't have link info, push as-is
              pages.push(page);
              writeDataFile(i);
            }
          });
        } else {
          page.noScrape = 1;
          pages.push(page);
          console.log('-NO SCRAPE-');
          writeDataFile(i);
        } // end fullSkip conditional
      } // end dups conditional
    //update count and check for end case
    i++;
    if (i < endLoop) { //pagesIn[pgI].mapsTo.length-1
         console.log(i+' of '+ endLoop);
         crawler();
    }
  //set delay between 1200 and 3600 milliseconds per request
  }, getRando(1200,3600))
}

crawler();

// async loop
// moves through each array item
// updates filenames
// clears
