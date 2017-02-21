//mapsTo collects links pointing at the main page
//from wikipedia's 'what links here' page

var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var nlp = require('nlp_compromise');

var content = fs.readFileSync('data/mapsTo.html');
var mapsTo = [];
var wiki = 'https://en.wikipedia.org/wiki/'
var $ = cheerio.load(content);
var count = 0;

$('ul#mw-whatlinkshere-list').find('a').each(function(i, elem) {

  var link = $(elem).attr('href');

  // exception list
  var junk = [
    link.includes('User_talk'),
    link.includes('Talk:'),
    link.includes('Template:'),
    link.includes('Wikipedia:'),
    link.includes('Wikipedia_talk:'),
    link.includes('User:'),
    link.includes('Portal:'),
    link.includes('w/index.php?')
  ]

  // check for exceptions
  var isJunk = false;
  for (var c in junk) {
    if (junk[c] == true) {
      isJunk = true;
      break;
    }
  }

  // add not-junk to mapsTo array
  if (!isJunk) {
    link = link.slice(wiki.length, link.length);
    mapsTo.push(link)
    count++;
  }

})

fs.writeFile('s-mapsTo-out.json', JSON.stringify(mapsTo), function(err) {
  if (err) {throw err;}
  console.log('mapsTo written')
})

console.log(JSON.stringify(mapsTo));
console.log(count);
