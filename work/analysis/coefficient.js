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

// rankings output array of url hash objects to track iterations of rankings function
var rankOut = [];

function rankings(iteration) {

  rankOut[iteration] = {};

  for (var url in args) {
    if (args.hasOwnProperty(url)) {

      // seperate output space from parameter space
      rankOut[iteration][url] = args[url].rank;

      // calculate rank and assign to output space
      for (var j in args[url].mapsFrom) {
        var mfurl = args[url].mapsFrom[j];

        if (iteration==0) {
          // initial values
          rankOut[iteration][url] += (args[mfurl].rank/args[mfurl].mapsToLen);
        } else {
          // using previous
          rankOut[iteration][url] += (rankOut[iteration-1][url]/args[mfurl].mapsToLen);
        }
      }

    }
  }

}

// call rankings function
rankings(0);

var fileOut;
// build ranking stats per iteration
function rankStats(iteration) {

    console.log('---->ITERATION: '+iteration)
    var justRanks = [];
    for (var url in rankOut[iteration]) {
      justRanks.push(rankOut[iteration][url]);
    }
    fileOut = d3.entries(rankOut[iteration]);

    console.log('url count:'+justRanks.length);
    console.log('singular rank (1 link): '+initRank+'\n');

    console.log('MAX: '+d3.max(justRanks));
    console.log('MIN: '+d3.min(justRanks));
    console.log('MEAN: '+d3.mean(justRanks));
    console.log('MEDIAN: '+d3.median(justRanks));
    console.log('STD DEV: '+d3.deviation(justRanks)+'\n');

    console.log('MAX (links): '+d3.max(justRanks)*justRanks.length);
    console.log('MIN (links): '+d3.min(justRanks)*justRanks.length);
    console.log('MEAN (links): '+d3.mean(justRanks)*justRanks.length);
    console.log('MEDIAN (links): '+d3.median(justRanks)*justRanks.length);
    console.log('STD DEV (links): '+d3.deviation(justRanks)*justRanks.length);

    console.log(fileOut[0]);

}

rankStats(0);

console.log('Duplicates: '+duplicates.length);
console.log();



fs.writeFile('data/urlcoefficients.json', JSON.stringify(fileOut), function(err) {
    if (err) {throw err;}
    console.log('file written');
});
