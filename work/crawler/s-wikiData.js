// s-wikiData.js scrapes the data page for wiki page
// and produces a basic data object with the included descriptors
// assigned to categories, and values assigned to arrays

var cheerio = require('cheerio');

// inclusions list (FIX CODE)
var inclusions = [
  // base categorical info
  'instance of',
  'part of',
  'influenced by',
  // date info
  'inception',
  'publication date',
  'date of birth',
  'date of death',
  'first performance',
  // geo info
  'location',
  'sovereign state',
  'coordinate location',
  'country',
  'located in the administrative territorial entity',
  'country of origin',
  'country of citizenship',
  'place of birth',
  'place of death',
  'place of burial',
  // incidentals
  'occupation',
  'sex or gender',
  'languages spoken, written or signed',
  'image',
  'pseudonym',
  'educated at',
  'given name'
]

module.exports = {

  scrape: function(content) { //content

    var attrs = {};
    var $ = cheerio.load(content);

    $('div.wikibase-statementgroupview').each(function(i, elem){

      var cat = $(elem).find('div.wikibase-statementgroupview-property').text().trim();

      // check for categories
      var skip = true;
      for (var i in inclusions) {
        if (cat.includes(inclusions[i])) {
          skip = false;
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
