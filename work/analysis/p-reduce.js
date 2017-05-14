// reduce removes any urls not currently included
// and calls p-rank to assign ranks / produce a top quartile set

var request = require('request');
var fs = require('fs');
var d3 = require('d3');

//local module
var rank = require('./p-rank')

// var dataIn_1 = JSON.parse(fs.readFileSync('data/cleaned-mapsTo.json'));
// var dataIn_2 = JSON.parse(fs.readFileSync('data/cleaned-mapsFrom.json'));
var dataIn_unranked = JSON.parse(fs.readFileSync('data/d2-sample-combined-roots.json'));
var dataIn_ranked_1 = JSON.parse(fs.readFileSync('data/quantile-toCrawl.json'));
var dada = JSON.parse(fs.readFileSync('data/Dada-update0.json'));
var dataIn_ranked = dataIn_ranked_1.concat(dada);

var urlSet_1 = [];
var urlSet_2 = [];

function getURLs(data, urls) {

  for (var i in data) {
    if (data[i].hasOwnProperty('url')) {
      urls[data[i].url] = 1;
    }
  }
  // console.log(urls);

}

getURLs(dataIn_unranked, urlSet_1);
getURLs(dataIn_ranked, urlSet_1);

function curator(data, urls) {

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

curator(dataIn_unranked, urlSet_1);
curator(dataIn_ranked, urlSet_1);

// ranks are calculated based on closed-network - e.g. relevance to Dada, not overall
var rankSets = rank.ranks(dataIn_unranked, dataIn_ranked);
var fullSet = rankSets[0];
var topQuartile= rankSets[1];

//output for prototype
function prototypeDataRanks(data) {
  var dataReduce = [];
  for (var i in data) {
    url = data[i].url;
    data[i].rank = fullSet[0][url];
    if (topQuartile.hasOwnProperty(url)) dataReduce.push(data[i]);
  }
  console.log(dataReduce.length);
  return dataReduce;
}

var d2_reduced_topQuartile = prototypeDataRanks(dataIn_unranked);
var d1_reduced_newRanks = prototypeDataRanks(dataIn_ranked);

var prototypeData = d1_reduced_newRanks.concat(d2_reduced_topQuartile);

getURLs(prototypeData, urlSet_2);
curator(prototypeData, urlSet_2);

// var d1d2_fullSet = dataIn_ranked.concat(dataIn_unranked);

// fs.writeFile('data/rankSets.json', JSON.stringify(rankSets), function(err){
//     if (err) {throw err;}
//     console.log('rankSets written');
// })

fs.writeFile('data/prototypeData-sample.json', JSON.stringify(prototypeData), function(err) {
    if (err) {throw err;}
    console.log('prototype sample written');
});

// fs.writeFile('data/prototypeData-d1-d2.json', JSON.stringify(prototypeData), function(err){
//     if (err) {throw err;}
//     console.log('prototypeData written');
// })

// ------------------------------------------------------------------

// fs.writeFile('data/prototypeData-fullSet.json', JSON.stringify(d1d2_fullSet), function(err){
//     if (err) {throw err;}
//     console.log('prototypeData-fullSet written');
// })

// ------------------------------------------------------------------

// var mapsTo_Crawl = prototypeDataRanks(dataIn_1_rank);
// var mapsFrom_Crawl = prototypeDataRanks(dataIn_2_rank);

// fs.writeFile('data/prototype-mapsFrom.json', JSON.stringify(dataIn_2), function(err) {
//     if (err) {throw err;}
//     console.log('mapsFrom written');
// });
//
// fs.writeFile('data/prototype-mapsTo.json', JSON.stringify(dataIn_1), function(err) {
//     if (err) {throw err;}
//     console.log('mapsTo written');
// });
//
// fs.writeFile('data/mapsTo_Crawl.json', JSON.stringify(mapsTo_Crawl), function(err) {
//     if (err) {throw err;}
//     console.log('mapsTo_Crawl written');
// });
//
// fs.writeFile('data/mapsFrom_Crawl.json', JSON.stringify(mapsFrom_Crawl), function(err) {
//     if (err) {throw err;}
//     console.log('mapsFrom_Crawl written');
// });
//
// fs.writeFile('dups.json', JSON.stringify(urls), function(err) {
//     if (err) {throw err;}
//     console.log('dups written');
// });
