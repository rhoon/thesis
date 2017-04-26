//mapsFrom collects links pointing at the main page
//from wikipedia's 'what links here' page

var cheerio = require('cheerio');
var _ = require('lodash');
var detect = require('./s-detect');

module.exports = {

  scrape: function(content) {
    var mapsFrom = [];
    var wiki = '/wiki/'
    var $ = cheerio.load(content);

    $('ul#mw-whatlinkshere-list').find('a').each(function(i, elem) {

      var link = $(elem).attr('href');
      link = link.slice(wiki.length, link.length);

      // check for exceptions
      var skip = false;
      if (detect.isJunk(link) || detect.isYr(link) || detect.isTooBroad(link) || detect.isCountry(link)) skip = true;

      // add not-junk to mapsFrom array
      if (!skip) mapsFrom.push(link)

    })

    // console.log(count);
    mapsFrom = _.uniq(mapsFrom);

    // console.log(mapsFrom);
    return mapsFrom;

  } //end scrape

}
