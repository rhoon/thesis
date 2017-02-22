// This app scrapes and compiles data from wikipedia pages collected by 'collect.js'

// building twoards data output:
// href - everything after the standard 'en.wiki' URL

///    links from this page            mapsTo    []
///    pages linking to this one       mapsFrom  []
///    category: person, place, ...    cat       str
///    text of link                    pageName  str
//-    distance from center node       dist      int (calculated)
//-    connectedness to center node    conn      int (calculated)
//-    relevance                       rel       f(dist, conn) {return int}

//     content
//       sub-cats                      subCats   []
//       associated dates              dates     []
//       associated geography          geo       []

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');
var dataScrape = require('./s-wikiData');
var mapsTo = require('./s-mapsTo');

var content = fs.readFileSync('data/dada.html');

var links = {};
var wiki = 'https://en.wikipedia.org/wiki/'
var thisPageURL = wiki+'Dada';
var $ = cheerio.load(content);

//from content, remove navboxes which are tangential information related to metadata
$('div.navbox').remove();

//find each a tag and write to an object
$('div#bodyContent').find('a').each(function(i, elem) {

  var link = $(elem).attr('href');

  //check for junk, then check for wiki in href
  if (link!=undefined) {
    if (link.includes('wiki') && !link.includes(thisPageURL)) {
      // reformat link to minimize extra info
      link = link.slice(wiki.length, link.length);
      // create new object
      links[link] = new Object();
      var linkText = $(elem).text();
      links[link].pageName = linkText;
      // console.log(linkText);
    }
  }
})

// mapsTo is the page for all the links
var mapsToURL = $('li#t-whatlinkshere').find('a').attr('href');
// wikiData
var wikiData = $('li#t-wikibase').find('a').attr('href');

// requests are de-activated to avoid mistakenly overwhelming servers in test runs
// request(mapsToURL, function(err, resp, body) {
//   if (err) {throw err;}
//     console.log(mapsToURL);
//     console.log(mapsTo.scrape(body));
// })
//
// request(wikiData, function(err, resp, body) {
// 	if (err) {throw err;}
//   console.log(wikiData);
//   console.log(dataScrape.scrape(body));
// });
