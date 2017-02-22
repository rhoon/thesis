//mapsFrom collects links pointing at the main page
//from wikipedia's 'what links here' page

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');
var _ = require('lodash');

// exception list
var exceptions = [
  'User_talk',
  'Talk:',
  'Template:',
  'Wikipedia:',
  'Wikipedia_talk:',
  'User:',
  'Portal:',
  'w/index.php?'
]

module.exports = {

  scrape: function(content) {
    var content = fs.readFileSync('data/mapsTo.html');
    var mapsFrom = [];
    var wiki = 'https://en.wikipedia.org/wiki/'
    var $ = cheerio.load(content);

    $('ul#mw-whatlinkshere-list').find('a').each(function(i, elem) {

      var link = $(elem).attr('href');

      // check for exceptions
      var skip = false;
      for (var c in exceptions) {
        if (link.includes(exceptions[c])) {
          skip = true;
          // console.log('skipping');
          break;
        }
      }

      // add not-junk to mapsFrom array
      if (!skip) {
        link = link.slice(wiki.length, link.length);
        mapsFrom.push(link)
        // console.log(link);
      }

    })

    // console.log(count);
    mapsFrom = _.uniq(mapsFrom);

    return mapsFrom;

  } //end scrape

}
