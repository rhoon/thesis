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
  "Category:",
  "wikisource.org",
  "Glossary_of_",
  "Wikipedia:Verifiability",
  "International_Standard_Book_Number",
  "wiktionary.org",
  "_(disambiguation)",
  "Book_talk:",
  "fr.wikipedia.org"
];

function hasNumber(myString) {
  return /\d/.test(myString);
}

module.exports = {

  isYr: function(earl) {

    var fact = false;
    if (hasNumber(earl)) {
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
