// assembles/curates the lean data for the prototype

var request = require('request');
var fs = require('fs');
var d3 = require('d3');

// var dataIn_1 = JSON.parse(fs.readFileSync('data/dada-mapsTo.json'));
// var dataIn_2 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500-1700.json'));
// var dataIn_3 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500.json'));

var dataIn_1 = JSON.parse(fs.readFileSync('data/cleaned-mapsTo.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/cleaned-mapsFrom.json'));

var urls = [];

// var cut = [
//   "BNE ID",
// "Benezit ID",
// "BnF ID",
// "CANTIC-ID",
// "Elonet person ID",
// "Encyclop\u00e6dia Britannica Online ID",
// "FAST-ID",
// "Filmportal ID",
// "Gran Enciclop\u00e8dia Catalana ID",
// "IMDb ID",
// "ISNI",
// "Kinopoisk person ID",
// "LCAuth ID",
// "Les Archives du Spectacle ID",
// "MoMA artist id",
// "NDLAuth ID",
// "NGA artist id",
// "NNDB people ID",
// "National Gallery of Victoria artist ID",
// "National Library of Israel ID",
// "National Thesaurus for Author Names ID",
// "Open Library ID",
// "PORT person ID",
// "People Australia ID",
// "Photographers' Identities Catalog ID",
// "Quora topic ID",
// "RKDartists ID",
// "SFDb person ID",
// "SUDOC authorities",
// "Social Networks and Archival Context ID",
// "Tate artist identifier",
// "Te Papa artist ID",
// "Thyssen-Bornemisza artist ID",
// "ULAN ID",
// "VIAF ID",
// "openMLOL author ID",
// "\u010cSFD person ID",
// "Encyclop\u00e6dia Britannica Online ID",
// "GeoNames ID",
// "Gran Enciclop\u00e8dia Catalana ID",
// "HDS ID",
// "ISNI",
// "LCAuth ID",
// "MusicBrainz area ID",
// "NE.se ID",
// "National Library of Israel ID",
// "OpenStreetMap Relation identifier",
// "SUDOC authorities",
// "Swiss municipality code",
// ]

function getURLs(data) {

  for (var i in data) {
    if (data[i].hasOwnProperty('url')) {
      urls[data[i].url] = 1;
    }
  }

}

getURLs(dataIn_1);
getURLs(dataIn_2);

function curator(data) {

  for (var i in data) {
    // check each set of mapsTo urls, cut ones that aren't in url set
    if (data[i].hasOwnProperty('mapsTo')) {
      var mT = data[i].mapsTo;
      console.log('mapsTo---------->URL: '+data[i].url);

      for (var j = 0; j < mT.length; j++) {
        if (!urls.hasOwnProperty(mT[j])) {
          // cut and iterate back a step
          mT.splice(j, 1);
          j--;
          console.log('cutting TO: '+mT[j]);
        } else {
          console.log('saving TO: '+mT[j]);
        } // end if has prop
      } // end loop j
    } // end if has mapsTo

    // check each set of mapsFrom urls, cut ones that aren't in url set
    if (data[i].hasOwnProperty('mapsFrom')) {
      var mF = data[i].mapsFrom;
      console.log('mapsFrom---------->URL: '+data[i].url);

      for (var j = 0; j < mF.length; j++) {
        if (!urls.hasOwnProperty(mF[j])) {
          // cut and iterate back a step
          mF.splice(j, 1);
          j--;
          console.log('cutting FROM: '+mF[j]);
        } else {
          console.log('saving FROM: '+mF[j]);
        } // end if has property
      } // end loop j
    } // end if mapsFrom


    // check wikiData item and remove matches to 'cut' array
    // if (data[i].hasOwnProperty('metaData')) {
    //   var wD = data[i].metaData;
    //   console.log('metaData---------->URL: '+data[i].url);
    //
    //     for (var k in cut) {
    //       if (wD.hasOwnProperty(cut[k])) {
    //         delete wD[cut[k]];
    //         console.log('cutting '+cut[k]);
    //       }
    //     }
    //
    // } // end if has wikiData

  }

}

curator(dataIn_1);
curator(dataIn_2);

//concat mapsFrom sets (dataIn_2, dataIn_3)
// var mapsFromFin = dataIn_2.concat(dataIn_3);

fs.writeFile('data/prototype-mapsFrom.json', JSON.stringify(dataIn_2), function(err) {
    if (err) {throw err;}
    console.log('mapsFrom written');
});

fs.writeFile('data/prototype-mapsTo.json', JSON.stringify(dataIn_1), function(err) {
    if (err) {throw err;}
    console.log('mapsTo written');
});
