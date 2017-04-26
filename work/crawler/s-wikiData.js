// s-wikiData.js scrapes the data page for wiki page
// and produces a basic data object with the included descriptors
// assigned to categories, and values assigned to arrays

var cheerio = require('cheerio');

// date info
var date = [
  'inception',
  'publication date',
  'date of birth',
  'date of death',
  'first performance'
]

// geo info
var geo = [
  'location',
  'sovereign state',
  'coordinate location',
  'country',
  'located in the administrative territorial entity',
  'country of origin',
  'country of citizenship',
  'place of birth',
  'place of death',
  'place of burial'
]

var misc = [
  'occupation',
  'sex or gender',
  'languages spoken, written or signed',
  'image',
  'pseudonym',
  'educated at',
  'given name'
]

var base = [
  // base categorical info
  'instance of',
  'part of',
  'influenced by',
]

dateJunk = [
  'Gregorian',
  'Julian',
  'instance',
  'sourcing',
  '\n',
  'earliest',
  'latest',
  'locationThéâtre',
  'place'
]

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function yearScrubber(str) {
  var dateX = /\d\d\d\d/;
  var d;
  for (var j in dateJunk) {
    str = replaceAll(str, dateJunk[j], '');
  }
  var strs = str.split(' ');
  for (s in strs) {
    if (dateX.test(strs[s])) {
      d = strs[s];
      // console.log('DATE '+ d);
    }
  }
  return d;
}

var inclusions = []
inclusions = base.concat(date, geo, misc);

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

          // check for and clean date information
          for (var d in date) {
            if (date[d]==cat) {
              attrs[cat][0] = yearScrubber(attrs[cat][0]);
            }
          }

        });
      }
    }); // end div.wikibase-statementgroupview.listview-item

    return attrs;

  } // end scrape function

}; // end exports
