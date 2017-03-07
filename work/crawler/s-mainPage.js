// Scrapes and compiles data from wikipedia pages collected by 'collect.js'
// Takes two parameters: 1) content - the body of the scraped page,
// and 2) url - the url of the scraped page;

// Only collects links to human-written content, or images.
// Only collects links that are written into content (not navbars, navboxes, or similar items)
// Does not include duplicate links from a single page

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');
var _ = require('lodash');

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

module.exports = {

 scrape: function(content, url, cb) {
  // var content = fs.readFileSync('data/dada.html');

  var wiki = '/wiki/'
  var $ = cheerio.load(content);
  var data = new Object;
  data.mapsTo = [];
  // url = url.slice(wiki.length, url.length);

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

      if (link.includes('wiki') && !link.includes(wiki+url) && !skip) {

        // reformat link to minimize excess
        link = link.slice(wiki.length, link.length);
        // create new object
        data.mapsTo.push(link);
      }
    }

  })

  //remove duplicates, append to object
  data.mapsTo = _.uniq(data.mapsTo);

  // set URLs to scrape
  data.wikiData = $('li#t-wikibase').find('a').attr('href');
  
  return data;

} //end scrape

} // end exports
