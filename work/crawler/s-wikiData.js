//s-wikiData.js scrapes the data page for each URL
//

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');

var content = fs.readFileSync('data/Q6034.html');
var mapsTo = [];
var wiki = 'https://en.wikipedia.org/wiki/'
var $ = cheerio.load(content);

$('div.wikibase-statementgroupview.listview-item').each(function(i, elem){

  console.log($(elem).text);

})
