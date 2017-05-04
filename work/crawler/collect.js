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
var d3 = require('d3');

//local modules
var dataScrape = require('./s-wikiData');
var mF = require('./s-mapsFrom');
var mT = require('./s-mainPage');
var detect = require('./s-detect');

var pagesIn = JSON.parse(fs.readFileSync('randomSample.json'));
    // pagesIn_2 = JSON.parse(fs.readFileSync('mapsTo_Crawl.json'));

// pagesIn = pagesIn.concat(pagesIn_2);

var dups = JSON.parse(fs.readFileSync('dups.json'));

//data
var pages = [],
    lastBatch = 0;

//c = count, s = stop, d = done (boolean)
var nl_c = 1,
    nl_s = 10,
    mapsToDone = false,
    mapsFromDone = false,
    urlArr,                       // urlArr to scrape
    filenames = [],               // store filenames
    t_c = 0,                      // inner counter
    t_s = 10,                     // inner stop point (init value is random)
    delay = [1200,3600];          // delay for timeout

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

function writeDataFile(location, counter) {
  //counter++;
  if (counter>=t_s || counter%250==0) { //if last loop or if counter is divisible by 250, write the file

    var maps = function() { if (mapsToDone) { return 'mapsFrom'; } else { return 'mapsTo'; } }
    var filename = 'data/'+maps()+'-index'+location+'-batch'+lastBatch+'-'+counter+'.json';
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
          dups[urlArr[t_c]] = 1;          // add to dups
          delay = [1200,3600];

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
                       writeDataFile(nl_c, t_c);
                   });
                 } else {
                   // case no wikiData
                   page.metaData = null;
                   pages.push(page);
                   writeDataFile(nl_c, t_c);
                 }
              }); // end mainPage request
            } else {
              // some page types don't have link info, push as-is
              pages.push(page);
              writeDataFile(nl_c, t_c);
            }
          });
        } else {
          page.noScrape = 1;
          pages.push(page);
          console.log('-NO SCRAPE-');
          writeDataFile(nl_c, t_c);
        } // end fullSkip conditional
      } else {
        // track url distribution
        dups[urlArr[t_c]]++;
        // no delay on dups
        delay = [0,0];
      } // end dups conditional

    // iterator
    if (t_c < t_s) { //pagesIn[pgI].mapsTo.length-1
      console.log(t_c+' of '+ t_s);
      t_c++;
      crawler();
    } else {
      console.log('CRAWL COMPLETE: '+nl_c+' OF '+nl_s);
      // clear memory with setTimeout (recursion results in stack overflow)
      setTimeout( function() {
        writeDataFile(nl_c, t_c);
        isDone();
      }, 0 );
    }

  //set delay between 1200 and 3600 milliseconds per request
}, getRando(delay[0],delay[1]))
}
// ------------------------------------------------------------------------------

function nextList() {

  nl_s =  pagesIn.length-1;

  // if the page does not have url attr, mark it done
  if (!pagesIn[nl_c].hasOwnProperty('mapsTo') || pagesIn[nl_c].mapsTo.length==0) mapsToDone = true;
  if (!pagesIn[nl_c].hasOwnProperty('mapsFrom') || pagesIn[nl_c].mapsFrom.length==0) mapsFromDone = true;

  if (!mapsToDone) {
    t_s = pagesIn[nl_c].mapsTo.length-1;
    urlArr = pagesIn[nl_c].mapsTo;
  } else if (!mapsFromDone) {
    t_s = pagesIn[nl_c].mapsFrom.length-1;
    urlArr = pagesIn[nl_c].mapsFrom;
  }

  crawler(); // tester();

}

function isDone() {  // if inner loop is complete

  if (nl_c < nl_s) {  // if not end of array of obj

    // iterate nLCount, reset inner count
    t_c = 0;
    lastBatch = 0;
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
      writeFilenames();
      nextList();
    }

  } else {
    console.log('done');
    writeFilenames();
  }
}

nextList();
// console.log(pagesIn_2[42].mapsTo);
// console.log(dups);

//periodically update the names of files written so far
function writeFilenames() {
  fs.writeFile('data/filenames.json', JSON.stringify(filenames), function(err) {
      if (err) {throw err;}
      console.log('filenames written');
  });

  fs.writeFile('data/dups.json', JSON.stringify(dups), function(err) {
      if (err) {throw err;}
      console.log('dups written');
  });
}

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
