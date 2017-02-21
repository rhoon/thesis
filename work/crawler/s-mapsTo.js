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

// exception list
var exceptions = [
  'User_talk',
  'Talk:',
  'Template:',
  'Wikipedia:',
  'Wikipedia_talk:',
  'User:',
  'Portal:',
  'w/index.php?'
]

$('ul#mw-whatlinkshere-list').find('a').each(function(i, elem) {

  var link = $(elem).attr('href');

  // check for exceptions
  var skip = false;
  for (var c in exceptions) {
    if (link.includes(exceptions[c])) {
      skip = true;
      console.log('skipping');
      break;
    }
  }

  // add not-junk to mapsTo array
  if (!skip) {
    link = link.slice(wiki.length, link.length);
    mapsTo.push(link)
    count++;
    console.log(link);
  }

})

fs.writeFile('s-mapsTo-out.json', JSON.stringify(mapsTo), function(err) {
  if (err) {throw err;}
  console.log('mapsTo written')
})

// console.log(JSON.stringify(mapsTo));
console.log(count);
