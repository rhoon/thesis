var fs = require('fs');
var async = require('async');

var cheerio = require('cheerio');
var _ = require('lodash');

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

var cities = [];
// console.log($('tbody').text())


function collectCities(prefix) {

  var content = fs.readFileSync('citiesRaw/'+prefix+'.html');

  var $ = cheerio.load(content);

  $('tbody').find('tr').each(function(i, elem) {

    var city = new Object;
    city.name = $(elem).find('a').eq(0).text();
    city.href = $(elem).find('a').eq(0).attr('href');
    city.country = $(elem).find('a').eq(1).text();

    cities.push(city);

  });

}

for (var letter in alphabet) {
  collectCities(alphabet[letter]);
}

console.log(cities);

fs.writeFile('cities.json', JSON.stringify(cities), function(err) {
        if (err) {throw err;}
        console.log('cities written');
});

// loop through all letters of alphabet
