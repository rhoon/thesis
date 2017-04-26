var fs = require('fs');

//all of wikipedia's countryURLs
var countryURLs = JSON.parse(fs.readFileSync('data/countries.json'));

// these are checked with 'includes'
var junkURLs = [
  'Special:',
  'Category:',
  'ex.php?',
  'Help:',
  'Wikipedia:LIBRARY',
  'Public_domain',
  'Wikipedia:Citation_needed',
  'File:Wikiquote-logo.svg',
  'File:Commons-logo.svg',
  "_modern_and_contemporary_",
  'User_talk',
  'Talk:',
  'Template:',
  'Wikipedia:',
  'Wikipedia_talk:',
  'User:',
  'Portal:',
  'w/index.php?',
  "Index_of_",
  "List_of_",
  "_century",
  "Culture_of_",
  "History_of_",
  "Timeline_of_",
  "es.wikipedia.org",
  "de.wikipedia.org",
  "ja.wikipedia.org",
  "nl.wikipedia.org",
  "Category:",
  "wikisource.org",
  "Glossary_of_",
  "Wikipedia:Verifiability",
  "International_Standard_Book_Number",
  "wiktionary.org",
  "_(disambiguation)",
  "Book_talk:",
  "fr.wikipedia.org",
  "_talk:",
  "Draft:",
  "21st-century_",
  "20th-century_",
  "19th-century_",
  "18th-century_",
  "World_War_",
];

// these are checked with equality
var tooBroad = [
  "Art",
  "Art_movement",
  "Poetry",
  "Performance_art",
  "Abstract_art",
  "Painting",
  "Poet",
  "Sculpture",
  "Satire",
  "Artist",
  "Literature",
  "French_literature",
  "Art_history",
  "Art_of_Europe",
  "Art_of_Asia",
  "Art_of_America",
  "Western_painting",
  "Cultural_movement",
  "Colonialism",
  "Irrationality",
  "Fascism_and_ideology",
  "Comedy_(drama)",
  "Retrospective",
]

// for filtering
var months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
]

function hasYear(myString) {
  return /\d\d\d\d/.test(myString);
}

module.exports = {

  isCountry: function(earl) {

    var fact = false;
    for (var c in countryURLs) {
      if (earl===countryURLs[c]) {
        fact = true;
        break;
      }
    }
    return fact;
  },

  isTooBroad: function(earl) {

    var fact = false;
    for (var t in tooBroad) {
      if (earl===tooBroad[t]) {
        fact = true;
        break;
      }
    }
    return fact;

  },

  isYr: function(earl) {

    var fact = false;
    if (hasYear(earl)) {
      for (var yr = 1800; yr<2018; yr++) {

        if (earl.includes(yr+'_in_')) {
          fact = true;
          break;
        } else if (earl == yr) {
          fact = true;
          break;
        } else if (earl == yr+'s') {
          fact = true;
          break;
        }

        if (earl.length>10) {
          for (var mo in months) {
            if (earl.includes(months[mo]+'_'+yr)) {
              fact = true;
              break;
            }
          }
        }

      }
    }
    return fact;

  },

  isJunk: function(earl) {

    var fact = false;
    for (var j in junkURLs) {
      if(earl.includes(junkURLs[j])) {
        fact = true;
        break;
      }
    }

    return fact;

  }

}
