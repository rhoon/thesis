// This app scrapes and compiles data from wikipedia pages collected by 'collect.js'

// final data structure:
// href
//    nearest previous header tag?
//    category: person, place, ...
//    text of link
//    associated dates
//    geography

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');

var content = fs.readFileSync('data/dada.html');

var links = {};

//will need to make this dynamic
var thisPageURL = 'https://en.wikipedia.org/wiki/Dada';

var $ = cheerio.load(content);

$('body').find('a').each(function(i, elem) {

  var page = $(elem).attr('href');
  links[page] = new Object();

  // links[page].cat =nlp goes here;

})

// console.log(JSON.stringify(links));
