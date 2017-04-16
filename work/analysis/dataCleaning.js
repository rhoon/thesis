// cleans dataSet - removes list / index pages, removes wikipedia junk pages, removes wikiData junk

var request = require('request');
var fs = require('fs');
var d3 = require('d3');

var dataIn_1 = JSON.parse(fs.readFileSync('data/dada-mapsTo.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500-1700.json'));
var dataIn_3 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500.json'));

var junkURLs = [
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
  "Book_talk:"
];

var cut = [
  "BNE ID",
  "Benezit ID",
  "BnF ID",
  "CANTIC-ID",
  "Elonet person ID",
  "Encyclop\u00e6dia Britannica Online ID",
  "FAST-ID",
  "Filmportal ID",
  "Gran Enciclop\u00e8dia Catalana ID",
  "IMDb ID",
  "ISNI",
  "Kinopoisk person ID",
  "LCAuth ID",
  "Les Archives du Spectacle ID",
  "MoMA artist id",
  "NDLAuth ID",
  "NGA artist id",
  "NNDB people ID",
  "National Gallery of Victoria artist ID",
  "National Library of Israel ID",
  "National Thesaurus for Author Names ID",
  "Open Library ID",
  "PORT person ID",
  "People Australia ID",
  "Photographers' Identities Catalog ID",
  "Quora topic ID",
  "RKDartists ID",
  "SFDb person ID",
  "SUDOC authorities",
  "Social Networks and Archival Context ID",
  "Tate artist identifier",
  "Te Papa artist ID",
  "Thyssen-Bornemisza artist ID",
  "ULAN ID",
  "VIAF ID",
  "openMLOL author ID",
  "\u010cSFD person ID",
  "Encyclop\u00e6dia Britannica Online ID",
  "GeoNames ID",
  "Gran Enciclop\u00e8dia Catalana ID",
  "HDS ID",
  "ISNI",
  "LCAuth ID",
  "MusicBrainz area ID",
  "NE.se ID",
  "National Library of Israel ID",
  "OpenStreetMap Relation identifier",
  "SUDOC authorities",
  "Swiss municipality code",
]

function hasNumber(myString) {
  return /\d/.test(myString);
}

function isYr(earl) {

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

}

function isJunk(earl) {

  var fact = false;
  for (var j in junkURLs) {
    if(earl.includes(junkURLs[j])) {
      fact = true;
      break;
    }
  }

  return fact;

}

// recursive function that removes junk objects until it reaches not junk objects
function objCheck(d, i) {
  earl = d[i].url;
  console.log('objCheck: '+earl);
  if (isYr(earl) || isJunk(earl)) {
    console.log('cutting object ^')
    d.splice(i, 1);
    if (isYr(earl) || isJunk(earl)) {
      console.log('calling again');
      objCheck(d, i);
    }
  }

}

var totalLoops = 0;

function scrubber(data) {

  for (var i in data) {

    totalLoops++;

    // check each url for junk / yr, cut ones that are. is a recursive function
    objCheck(data, i);

    // check each set of mapsTo urls, cut ones that are included in junk set
    // will need to use 'includes' rather than a direct match
    if (data[i].hasOwnProperty('mapsTo')) {
      var mT = data[i].mapsTo;
      console.log('mapsTo---------->URL: '+data[i].url);

      for (var j in mT) {

        //cut JunkURLs and year surveys
        if (isJunk(mT[j]) || isYr(mT[j])) {
          console.log('cutting TO: '+mT[j])
          mT.splice(j, 1);
        }

      } // end loop j
    } // end if has mapsTo


    if (data[i].hasOwnProperty('mapsFrom')) {
      var mF = data[i].mapsFrom;
      console.log('mapsFrom-------->URL: '+data[i].url);

      for (var j in mF) {

        //cut JunkURLs and year surveys
        if (isJunk(mF[j]) || isYr(mF[j])) {
          console.log('cutting TO: '+mF[j])
          mF.splice(j, 1);
        }

      } // end loop j
    }

    // check wikiData item and remove matches to 'cut' array
    if (data[i].hasOwnProperty('metaData')) {
      var wD = data[i].metaData;
      console.log('metaData---------->URL: '+data[i].url);

        for (var k in cut) {
          if (wD.hasOwnProperty(cut[k])) {
            delete wD[cut[k]];
            console.log('cutting wikiData item'+cut[k]);
          }
        }

    } // end if has wikiData

  }

}

scrubber(dataIn_1);
scrubber(dataIn_2);
scrubber(dataIn_3);

console.log(totalLoops);

//concat mapsFrom sets (dataIn_2, dataIn_3)
var mapsFromFin = dataIn_2.concat(dataIn_3);

fs.writeFile('data/cleaned-mapsFrom.json', JSON.stringify(mapsFromFin), function(err) {
    if (err) {throw err;}
    console.log('mapsFrom written');
});

fs.writeFile('data/cleaned-mapsTo.json', JSON.stringify(dataIn_1), function(err) {
    if (err) {throw err;}
    console.log('mapsTo written');
});
