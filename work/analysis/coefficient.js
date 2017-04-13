var request = require('request');
var fs = require('fs');
var d3 = require('d3');

// data cannot include points that have not been scraped yet
var dataIn_1 = JSON.parse(fs.readFileSync('data/prototype-mapsFrom.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/prototype-mapsTo.json'));


totalURLs = 1591;
initRank = 1/totalURLs;

args = {};

console.log(dataIn_1[2]['mapsTo'].length);

duplicates = [];

// the PageRank conferred by an outbound link is equal to the document's own PageRank score divided by the number of outbound links L( )


// restructure for easy reference / less lookups in calculations
function parameters(data) {

  for (var i in data) {

      if (!args.hasOwnProperty(data[i].url)) {
        args[data[i].url] = {};
      } else {
        duplicates.push(data[i].url);
      }

      if (data[i].hasOwnProperty('mapsTo')) {
        args[data[i].url].mapsToLen = data[i].mapsTo.length;
        if (data[i].mapsTo.length==0) {
          args[data[i].url].mapsToLen = 1;
        }
      } else {
        args[data[i].url].mapsToLen = 1;
      }

      if (data[i].hasOwnProperty('mapsFrom')) {
        args[data[i].url].mapsFrom = data[i].mapsFrom;
      } else {
        args[data[i].url].mapsFrom = [];
      }

      //initialize rankings
      args[data[i].url].rank = initRank;

  }
}

parameters(dataIn_1);
parameters(dataIn_2);

function rankings() {

  for (var url in args) {
    if (args.hasOwnProperty(url)) {

      for (var j in args[url].mapsFrom) {
        var mfurl = args[url].mapsFrom[j];
        // console.log(args[mfurl]);
        args[url].rank += (initRank/args[mfurl].mapsToLen);
        // console.log('mfurl rank:'+args[mfurl].rank);
        // console.log('mfurl mapsToLen: '+args[mfurl].mapsToLen);
      }

      // console.log('FOR SUM: '+url+' rank: '+args[url].rank);

    }
  }

}
// Google recalculates PageRank scores each time it crawls the Web and rebuilds its index.
// As Google increases the number of documents in its collection, the initial approximation
// of PageRank decreases for all documents.
rankings();

// build ranking stats
function rankStats() {

    var justRanks = [];
    for (var i in args) {
      justRanks.push(args[i].rank);
    }
    console.log('url count:'+justRanks.length);
    console.log('singular rank (1 link): '+initRank);
    console.log('MAX: '+d3.max(justRanks));
    console.log('MIN: '+d3.min(justRanks));
    console.log('MEAN: '+d3.mean(justRanks));
    console.log('MEDIAN: '+d3.median(justRanks));
    console.log('STD DEV: '+d3.deviation(justRanks));

    console.log('MAX (links): '+d3.max(justRanks)*justRanks.length);
    console.log('MIN (links): '+d3.min(justRanks)*justRanks.length);
    console.log('MEAN (links): '+d3.mean(justRanks)*justRanks.length);
    console.log('MEDIAN (links): '+d3.median(justRanks)*justRanks.length);
    console.log('STD DEV (links): '+d3.deviation(justRanks)*justRanks.length);

}

rankStats();

console.log('Duplicates: '+duplicates.length);
console.log();

// console.log(ranks);
  // create an object rank

  // rank.url = this url
  // rank.sum = 0;

  // for each url in mapsFrom
    // divide that url's initRank by how many links IT maps to
    // add it to the rank sum
    //
