// get all of wikipedia's country urls,
// push them to an array

var cheerio = require('cheerio');
var fs = require('fs');

var wikiCountries = fs.readFileSync('wiki-countries.html');

var $ = cheerio.load(wikiCountries);

var countryList = [];

$('table.sortable.wikitable').find('tr').each(function(i, elem) {

    var td = $(elem).find('a').attr('href');

    if (td!=undefined) {

      var wiki = 'https://en.wikipedia.org/wiki/';
      td = td.slice(wiki.length, td.length);
      countryList.push(td);
    }
});

fs.writeFile('countries.json', JSON.stringify(countryList), function(err) {
    if (err) {throw err;}
    console.log('file written');
});
