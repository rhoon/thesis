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

var pagesIn = JSON.parse(fs.readFileSync('mapsFrom_Crawl.json'))
    pagesIn_2 = JSON.parse(fs.readFileSync('mapsTo_Crawl.json'));

pagesIn = pagesIn.concat(pagesIn_2);

var dups = JSON.parse(fs.readFileSync('dups.json'));

//data
var pages = [],
    lastBatch = 0;

//c = count, s = stop, d = done (boolean)
var nl_c = 0,
    nl_s = 10,
    mapsToDone = false,
    mapsFromDone = false,
    urlArr,                       // urlArr to scrape
    filenames = [],               // store filenames
    t_c = 0,                      // inner counter
    t_s = 10;                     // inner stop point (init value is random)

// test URLs - 'Francis_Picabia' - 'Ann%C3%A9es_folles' - 'Dada'

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

function getRando(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function writeDataFile(counter) {
  //counter++;
  if (counter>=t_s || counter%250==0) { //if last loop or if counter is divisible by 250, write the file
    var filename = 'data/d2-'+lastBatch+'-'+counter+'.json';
    fs.writeFile(filename, JSON.stringify(pages), function(err) {
        if (err) {throw err;}
        console.log(filename+' written');
        filenames.push(filename);
        lastBatch = counter;
        pages = [];
    });
  }
}

function crawler() {           //  create a loop function
   setTimeout(function () {    //  call a 3s setTimeout when the loop is called

        // check for already scraped urls
        if(!dups.hasOwnProperty(urlArr[t_c])) {

          var page = new Object;
          page.distance = 2;
          page.root = pagesIn[nl_c].url;
          page.url =  urlArr[t_c];        // testURL_1;
          dups[urlArr[t_c]] = 1;

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
                       writeDataFile(t_c);
                   });
                 } else {
                   // case no wikiData
                   page.metaData = null;
                   pages.push(page);
                   writeDataFile(t_c);
                 }
              }); // end mainPage request
            } else {
              // some page types don't have link info, push as-is
              pages.push(page);
              writeDataFile(t_c);
            }
          });
        } else {
          page.noScrape = 1;
          pages.push(page);
          console.log('-NO SCRAPE-');
          writeDataFile(t_c);
        } // end fullSkip conditional
      } else {
        dups[urlArr[t_c]]++;
      } // end dups conditional

    // iterator
    if (t_c < t_s) { //pagesIn[pgI].mapsTo.length-1
      console.log(t_c+' of '+ t_s);
      t_c++;
      crawler();
    } else {
      console.log('CRAWL: '+nl_c);
      // clear memory with setTimeout (recursion results in stack overflow)
      setTimeout( function() {
        isDone();
      }, 0 );
    }

  //set delay between 1200 and 3600 milliseconds per request
  }, getRando(1200,3600))
}
// ------------------------------------------------------------------------------

function nextList() {

  nl_s =  pagesIn.length-1;

  // if the page does not have url attr, mark it done
  if (!pagesIn[nl_c].hasOwnProperty('mapsTo')) mapsToDone = true;
  if (!pagesIn[nl_c].hasOwnProperty('mapsFrom')) mapsFromDone = true;

  if (!mapsToDone) {
    t_s = pagesIn[nl_c].mapsTo.length-1;
    urlArr = pagesIn[nl_c].mapsTo;
  } else {
    t_s = pagesIn[nl_c].mapsFrom.length-1;
    urlArr = pagesIn[nl_c].mapsFrom;
  }

  crawler(); // tester();

}

function isDone() {  // if inner loop is complete

  if (nl_c < nl_s) {  // if not end of array of obj

    // iterate nLCount, reset inner count
    t_c = 0;
    console.log(nl_s);

    if (!mapsToDone) {
      console.log('MAPS TO DONE');
      mapsToDone = true;
      nextList();
    } else {
      console.log('MAPS FROM DONE');
      mapsFromDone = true;
    }

    // only iterate nl_c if it has done mapsTo and mapsFrom
    if (mapsToDone && mapsFromDone) {
      nl_c++;
      mapsToDone = false;
      mapsFromDone = false;
      nextList();
    }

  } else {
    console.log(' done');
    fs.writeFile('data/filenames.json', JSON.stringify(filenames), function(err) {
        if (err) {throw err;}
        console.log('filenames written');
    });

    fs.writeFile('data/dups.json', JSON.stringify(dups), function(err) {
        if (err) {throw err;}
        console.log('dups written');
    });
  }
}

nextList();
// console.log(pagesIn_2[42].mapsTo);
// console.log(dups);

// for debugging

function tester() {
  if(!dups.hasOwnProperty(urlArr[t_c])) {
    console.log('T: '+t_c);
    // console.log('URL: '+urlArr[t_c]);
    dups[urlArr[t_c]] = 1;
  } else {
    // console.log('DUP');
  }
  // check for stop condition, if not, iterate, call self
  if (t_c < t_s) {
    t_c++;
    tester();
  } else {
    // clear memory with setTimeout (recursion results in stack overflow)
    setTimeout( function() {
      isDone();
    }, 0 );
  }
}
