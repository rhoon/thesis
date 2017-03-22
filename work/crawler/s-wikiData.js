// s-wikiData.js scrapes the data page for wiki page
// and produces a basic data object with the included descriptors
// assigned to categories, and values assigned to arrays

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');

// exception list
var exceptions = [
  'Dewey Decimal Classification',
  'BNCF Thesaurus',
  'NKCR AUT ID',
  'Freebase ID',
  'GND ID',
  'AAT ID',
  'PSH ID',
  'Enciclopedia Treccani ID',
  'Cultureel Woordenboek identifier'
]

module.exports = {

  scrape: function(content) { //content

    // var content = fs.readFileSync('data/Q6034.html');
    var attrs = {};
    var $ = cheerio.load(content);

    $('div.wikibase-statementgroupview').each(function(i, elem){

      var cat = $(elem).find('div.wikibase-statementgroupview-property').text().trim();

      // check for categories
      var skip = false;
      for (var e in exceptions) {
        if (cat.includes(exceptions[e])) {
          skip = true;
          break;
        }
      }

      if (!skip) {
        // create an array per category
        attrs[cat]= [];
        $(elem).find('.wikibase-statementview-mainsnak-container').each(function(i, elem){
          // add each item to the category
          var item = $(elem).text().trim();
          attrs[cat].push(item);
          // console.log(item);
        });
      }
    }); // end div.wikibase-statementgroupview.listview-item

    return attrs;

  } // end scrape function

}; // end exports
