//mapsFrom collects links pointing at the main page
//from wikipedia's 'what links here' page

var cheerio = require('cheerio');
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
  'w/index.php?',
  //added april 18
  "Index_of_",
  "List_of_",
  "_century",
  "Culture_of_",
  "History_of_",
  "Timeline_of_",
  "es.wikipedia.org",
  "de.wikipedia.org",
  "Category:",
  "wikisource.org",
  "Glossary_of_",
  "Wikipedia:Verifiability",
  "International_Standard_Book_Number",
  "wiktionary.org",
  "_(disambiguation)",
  "Book_talk:"
]

module.exports = {

  scrape: function(content) {
    var mapsFrom = [];
    var wiki = '/wiki/'
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

    // console.log(mapsFrom);
    return mapsFrom;

  } //end scrape

}
