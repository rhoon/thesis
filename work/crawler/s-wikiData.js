//s-wikiData.js scrapes the data page for each URL
//

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');

var content = fs.readFileSync('data/Q6034.html');
var attrs = {};
var wiki = 'https://en.wikipedia.org/wiki/'
var $ = cheerio.load(content);

// exception list
var exceptions = [
  'Commons category',
  'topic\'s main category',
  'Dewey Decimal Classification',
  'coincident with',
  'BNCF Thesaurus',
  'NKCR AUT ID',
  'Freebase ID',
  'GND ID',
  'AAT ID',
  'PSH ID',
  'Enciclopedia Treccani ID',
  'Cultureel Woordenboek identifier'
]


$('div.wikibase-statementgroupview.listview-item').each(function(i, elem){

  var cat = $(elem).find('div.wikibase-statementgroupview-property').text().trim();

  // check for categories
  var skip = false;
  for (var e in exceptions) {
    if (cat.includes(exceptions[e])) {
      skip = true;
    }
  }

  if (!skip) {
    // create an array per category
    attrs[cat]= [];
    $(elem).find('.wikibase-snakview-value.wikibase-snakview-variation-valuesnak').each(function(i, elem){
      // add each item to the category
      var item = $(elem).text().trim();
      attrs[cat].push(item);
    })
  }

})

console.log(attrs);
