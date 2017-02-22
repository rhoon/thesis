// This app scrapes and compiles data from wikipedia pages collected by 'collect.js'

// Only collects links to human-written content, or images.
// Only collects links that are written into content (not navbars, navboxes, or similar items)
// Does not include duplicate links from a single page

//  Output data structure:
///    this page's URL                  url       str
///    links from this page             mapsTo    []
///    pages linking to this one        mapsFrom  []
///    metaData from wiki's data page   metaData  {}

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');
var _ = require('lodash');

//local modules
var dataScrape = require('./s-wikiData');
var mapsFrom = require('./s-mapsFrom');

var content = fs.readFileSync('data/dada.html');

var page = new Object;
page.mapsTo = [];
page.url = 'Dada';

var wiki = 'https://en.wikipedia.org/wiki/'
var $ = cheerio.load(content);

var exceptions = [
  'Special:',
  'Category:',
  'ex.php?',
  'Help:',
  'Wikipedia:LIBRARY',
  'Public_domain',
  'Wikipedia:Citation_needed',
  'File:Wikiquote-logo.svg',
  'File:Commons-logo.svg'
]

//from content, remove navboxes which are tangential information related to metadata
$('div.navbox').remove();

//find each a tag and write to an object
$('div#bodyContent').find('a').each(function(i, elem) {

  var link = $(elem).attr('href');

  //check for junk, then check for wiki in href
  if (link!=undefined) {

    var skip = false;
    for (var e in exceptions) {
      if (link.includes(exceptions[e])) {
        skip = true;
        break;
      }
    }

    if (link.includes('wiki') && !link.includes(wiki+page.url) && !skip) {

      // reformat link to minimize excess
      link = link.slice(wiki.length, link.length);
      // create new object
      page.mapsTo.push(link);
    }
  }

})

//remove duplicates, append to object
page.mapsTo = _.uniq(page.mapsTo);

// mapsFrom is the page for all the page
var mapsFromURL = $('li#t-whatlinkshere').find('a').attr('href');
console.log(mapsFromURL);
// wikiData
var wikiData = $('li#t-wikibase').find('a').attr('href');
console.log(wikiData);

// requests are stacked to ensure they run before returning the completed 'page' object
request(mapsFromURL, function(err, resp, body) {
  if (err) {throw err;}
    page.mapsFrom = mapsFrom.scrape(body);
})

request(wikiData, function(err, resp, body) {
   if (err) {throw err;}
    page.metaData = dataScrape.scrape(body);
});

//generate random time in milliseconds between 30 secs and 1 min
function time() {
  return Math.random() * (60000 - 30000) + 3000;
}

//return object
setTimeout(function () {
  console.log(page);
}, time())
