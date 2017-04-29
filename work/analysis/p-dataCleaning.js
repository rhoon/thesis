// cleans dataSet - removes list / index pages, removes wikipedia junk pages, removes wikiData junk

var request = require('request');
var fs = require('fs');
var d3 = require('d3');
var detect = require('../crawler/s-detect');

var dataIn_1 = JSON.parse(fs.readFileSync('data/ec2/MapsFrom-update0-250.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/ec2/MapsFrom-update250-500.json'));
var dataIn_3 = JSON.parse(fs.readFileSync('data/ec2/MapsFrom-update500-750.json'));
var dataIn_4 = JSON.parse(fs.readFileSync('data/ec2/MapsFrom-update750-1000.json'));
var dataIn_5 = JSON.parse(fs.readFileSync('data/ec2/MapsFrom-update1250-1453.json'));
var dataIn_6 = JSON.parse(fs.readFileSync('data/ec2/MapsTo-update0-201.json'));
var dataIn_7 = JSON.parse(fs.readFileSync('data/ec2/MapsTo-update201-201.json'));

var mapsTo_In = dataIn_6.concat(dataIn_7);
var mapsFrom_In = dataIn_1.concat(dataIn_2, dataIn_3, dataIn_4, dataIn_5);

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

// imgJunk = [
//   "//upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Quill_and_ink.svg/25px-Quill_and_ink.svg.png",
//   "//upload.wikimedia.org/wikipedia/en/thumb/9/99/Question_book-new.svg/50px-Question_book-new.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Padlock-silver.svg/20px-Padlock-silver.svg.png",
//   "//upload.wikimedia.org/wikipedia/en/thumb/e/e7/Cscr-featured.svg/20px-Cscr-featured.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/0/06/Wiktionary-logo-v2.svg/40px-Wiktionary-logo-v2.svg.png",
//   "//upload.wikimedia.org/wikipedia/en/thumb/f/f2/Edit-clear.svg/40px-Edit-clear.svg.png",
//   "//upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/30px-Commons-logo.svg.png",
//   "//upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/19px-Symbol_support_vote.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Text_document_with_red_question_mark.svg/40px-Text_document_with_red_question_mark.svg.png",
//   "//upload.wikimedia.org/wikipedia/en/thumb/d/db/Symbol_list_class.svg/16px-Symbol_list_class.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ambox_important.svg/40px-Ambox_important.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Wikisource-logo.svg/12px-Wikisource-logo.svg.png",
//   "//upload.wikimedia.org/wikipedia/en/thumb/6/6c/Wiki_letter_w.svg/40px-Wiki_letter_w.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Nuvola_apps_kdict.svg/40px-Nuvola_apps_kdict.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/8/89/Symbol_book_class2.svg/16px-Symbol_book_class2.svg.png",
//   "//upload.wikimedia.org/wikipedia/en/thumb/f/fd/Portal-puzzle.svg/16px-Portal-puzzle.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Sharp.svg/40px-Sharp.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Unbalanced_scales.svg/45px-Unbalanced_scales.svg.png",
//   "//upload.wikimedia.org/wikipedia/commons/thumb/1/17/Blue_flag_waving.svg/70px-Blue_flag_waving.svg.png",
// ]


// recursive function that removes junk objects until it reaches not junk objects
function objCheck(d, i) {
  earl = d[i].url;
  console.log('objCheck: '+earl);
  if (detect.isYr(earl) || detect.isJunk(earl) || detect.isTooBroad(earl)) {
    console.log('cutting object ^')
    d.splice(i, 1);
    if (detect.isYr(earl) || detect.isJunk(earl) || detect.isTooBroad(earl)) {
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
        if (detect.isJunk(mT[j]) || detect.isYr(mT[j]) || detect.isTooBroad(mT[j])) {
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
        if (detect.isJunk(mF[j]) || detect.isYr(mF[j]) || detect.isTooBroad(mF[j])) {
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
          if (wD!=null) {
            if (wD.hasOwnProperty(cut[k])) {
              delete wD[cut[k]];
              console.log('cutting wikiData item'+cut[k]);
            }
          }
        }

    } // end if has wikiData

  }

}

scrubber(mapsTo_In);
scrubber(mapsFrom_In);

fs.writeFile('data/cleaned-mapsFrom.json', JSON.stringify(mapsFrom_In), function(err) {
    if (err) {throw err;}
    console.log('mapsFrom written');
});

fs.writeFile('data/cleaned-mapsTo.json', JSON.stringify(mapsTo_In), function(err) {
    if (err) {throw err;}
    console.log('mapsTo written');
});
