// cleans dataSet - removes list / index pages, removes wikipedia junk pages, removes wikiData junk

var request = require('request');
var fs = require('fs');
var d3 = require('d3');
var detect = require('../crawler/s-detect');

var dataIn_1 = JSON.parse(fs.readFileSync('data/ec2/mapsTo-r2-batch2.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/ec2/mapsTo-r2-batch3.json'));
var dataIn_3 = JSON.parse(fs.readFileSync('data/ec2/mapsFrom-r2-batch0.json'));
var dataIn_4 = JSON.parse(fs.readFileSync('data/ec2/mapsFrom-r2-batch1.json'));
var dataIn_5 = JSON.parse(fs.readFileSync('data/ec2/mapsFrom-r2-batch2.json'));
var dataIn_6 = JSON.parse(fs.readFileSync('data/ec2/mapsFrom-r2-batch3.json'));
var dataIn_7 = JSON.parse(fs.readFileSync('data/ec2/mapsFrom-r2-batch4.json'));

var mapsTo_In = dataIn_1.concat(dataIn_2);
var mapsFrom_In = dataIn_1.concat(dataIn_3, dataIn_4, dataIn_5, dataIn_6, dataIn_7);

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

// recursive function that removes junk objects until it reaches not junk objects
function objCheck(d, i) {
  earl = d[i].url;
  console.log('objCheck: '+earl);
  if (detect.isYr(earl) || detect.isJunk(earl)) {
    console.log('cutting object ^')
    d.splice(i, 1);
    if (detect.isYr(earl) || detect.isJunk(earl)) {
      console.log('calling again');
      objCheck(d, i);
    }
  }

}

var totalLoops = 0;

function scrubber(data) {

  for (var i in data) {

    // check each url for junk / yr, cut ones that are. is a recursive function
    objCheck(data, i);

    // check each set of mapsTo urls, cut ones that are included in junk set
    if (data[i].hasOwnProperty('mapsTo')) {
      var mT = data[i].mapsTo;
      console.log('mapsTo---------->URL: '+data[i].url);

      for (var j in mT) {
        //cut JunkURLs and year surveys
        if (detect.isJunk(mT[j]) || detect.isYr(mT[j])) {
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
        if (detect.isJunk(mF[j]) || detect.isYr(mF[j])) {
          console.log('cutting FROM: '+mF[j])
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

scrubber(mapsTo_In);
scrubber(mapsFrom_In);

// fs.writeFile('data/cleaned-mapsFrom.json', JSON.stringify(mapsFrom_In), function(err) {
//     if (err) {throw err;}
//     console.log('mapsFrom written');
// });
//
// fs.writeFile('data/cleaned-mapsTo.json', JSON.stringify(mapsTo_In), function(err) {
//     if (err) {throw err;}
//     console.log('mapsTo written');
// });
