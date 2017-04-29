// reduce removes any urls not currently included
// and calls p-rank to assign ranks / produce a top quartile set

var request = require('request');
var fs = require('fs');
var d3 = require('d3');

//local module
var rank = require('./p-rank')

var dataIn_1 = JSON.parse(fs.readFileSync('data/cleaned-mapsTo.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/cleaned-mapsFrom.json'));

var dataIn_1_rank = dataIn_1;
var dataIn_2_rank = dataIn_2;

var urls = [];

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
      for (var j = 0; j < mT.length; j++) {
        if (!urls.hasOwnProperty(mT[j])) {
          // cut and iterate back a step
          mT.splice(j, 1);
          j--;
        }
      }
    } // end if has mapsTo

    // check each set of mapsFrom urls, cut ones that aren't in url set
    if (data[i].hasOwnProperty('mapsFrom')) {
      var mF = data[i].mapsFrom;
      for (var j = 0; j < mF.length; j++) {
        if (!urls.hasOwnProperty(mF[j])) {
          // cut and iterate back a step
          mF.splice(j, 1);
          j--;
        }
      }
    }
  }
}

curator(dataIn_1);
curator(dataIn_2);

var rankSets = rank.ranks(dataIn_1, dataIn_2);
var fullSet = rankSets[0];
var topQuartile= rankSets[1];

console.log(topQuartile);
//output for prototype
function prototypeDataRanks(data) {
  var dataReduce = [];
  for (var i in data) {
    url = data[i].url;
    data[i].rank = fullSet[0][url];
    if (topQuartile.hasOwnProperty(url)) dataReduce.push(data[i]);
  }
  return dataReduce;
}

prototypeDataRanks(dataIn_1);
prototypeDataRanks(dataIn_2);

var mapsTo_Crawl = prototypeDataRanks(dataIn_1_rank);
var mapsFrom_Crawl = prototypeDataRanks(dataIn_2_rank);

fs.writeFile('data/prototype-mapsFrom.json', JSON.stringify(dataIn_2), function(err) {
    if (err) {throw err;}
    console.log('mapsFrom written');
});

fs.writeFile('data/prototype-mapsTo.json', JSON.stringify(dataIn_1), function(err) {
    if (err) {throw err;}
    console.log('mapsTo written');
});

fs.writeFile('data/mapsTo_Crawl.json', JSON.stringify(mapsTo_Crawl), function(err) {
    if (err) {throw err;}
    console.log('mapsTo_Crawl written');
});

fs.writeFile('data/mapsFrom_Crawl.json', JSON.stringify(mapsFrom_Crawl), function(err) {
    if (err) {throw err;}
    console.log('mapsFrom_Crawl written');
});

fs.writeFile('dups.json', JSON.stringify(urls), function(err) {
    if (err) {throw err;}
    console.log('dups written');
});
