//collect.js gets gets pages and runs them through the data pipeline

//  Output schema:
///    this page's URL                  url        str
///    the next closest root to Dada    url        str (will need to recalc this in post-processing)
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
    urlArr = pagesIn[pgI].mapsTo, // array of urls to scrape (this will be a parameter)
    i = 0,                          // loop start
    endLoop = urlArr.length-1,      // loop endPoint
    lastBatch = 0,                  // initialize lastBatch
    dups = {};                      // NEEDS TO BE IMPROVED track already scraped pages to avoid dups


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
    fs.writeFile('data/MapsTo-update'+lastBatch+'-'+counter+'.json', JSON.stringify(pages), function(err) {
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
        if(!dups.hasOwnProperty(pagesIn[pgI].mapsTo[i])) {

          var page = new Object;
          page.distance = 2;
          page.root = pagesIn[pgI].url; // will need to modify this for next batch?
          page.url =  urlArr[i];        // testURL_1;
          dups[pagesIn[pgI].mapsTo[i]] = 1;

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
// updates filenames in logical way
//  pushes filenames to array
//  writes array to .json after task complete
// clears vars

// ---------------------------------------
// var pagesFull = JSON.parse(fs.readFileSync('data/data/MapsFrom-update0-250.json'));
// var pagesCrawl_1 = JSON.
// // recursive loop
// // conditional iteration - waits for crawler to update global value
// // before moving to next object
// //c = count, s = stop, d = done (boolean)
// var t_c = 0;
// var t_s = 10;
// var t_d = false;
//
// var howManyIsThat = 0;
//
// function tester() {
//
//   if(!dups.hasOwnProperty(urlArrTest[t_c])) {
//     console.log('T: '+t_c);
//     console.log('URL: '+urlArrTest[t_c]);
//     howManyIsThat++;
//     dups[urlArrTest[t_c]] = 1;
//   }
//   // check for stop condition, if not, iterate, call self
//   if (t_c < t_s) {
//     t_c++;
//     tester();
//   } else {
//     t_d= true;
//     console.log('TEST END');
//   }
// }
//
// var nl_c = 0;
// var nl_s =  pagesFull.length-1;
// var mapsToDone = false;
// var mapsFromDone = false;
// var urlArrTest;
//
// function nextList() {
//
//   // do things here
//
//   // if the page does not have url attr, mark it done
//   if (!pagesFull[nl_c].hasOwnProperty('mapsTo')) mapsToDone = true;
//   if (!pagesFull[nl_c].hasOwnProperty('mapsFrom')) mapsToDone = true;
//
//   if (!mapsToDone) {
//     t_s = pagesFull[nl_c].mapsTo.length-1;
//     urlArrTest = pagesFull[nl_c].mapsTo;
//   } else {
//     t_s = pagesFull[nl_c].mapsFrom.length-1;
//     urlArrTest = pagesFull[nl_c].mapsFrom;
//   }
//
//   //
//   tester();
//   console.log(nl_c);
//
//   // check for stop condition, if not, iterate, call self & inner
//   if (t_d) {
//     // stop condition
//     if (nl_c < nl_s) {
//       // iterate nLCount, reset inner count
//       t_c = 0;
//       if (!mapsToDone) {
//         mapsToDone = true;
//         nextList();
//       } else {
//         mapsFromDone = true;
//       }
//       // only iterate nl_c if it has done mapsTo and mapsFrom
//       if (mapsToDone && mapsFromDone) {
//         nl_c++;
//         mapsToDone = false;
//         mapsFromDone = false;
//         nextList();
//       }
//
//     } else {
//       console.log('DONE');
//     }
//   }
//
// }
//
// nextList();
// console.log('HOW MANY? THIS MANY: '+howManyIsThat);
// console.log(dups);
