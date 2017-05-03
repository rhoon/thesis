var request = require('request');
var fs = require('fs');
var d3 = require('d3');
var async = require('async');
var _ = require('lodash');

var rankSets = JSON.parse(fs.readFileSync('data/rankSets.json'));

var dIn_1 = JSON.parse(fs.readFileSync('data/cleaned-mapsTo.json'));
var dIn_2 = JSON.parse(fs.readFileSync('data/cleaned-mapsFrom.json'));

// data = dIn_1.concat(dIn_2);

var dups = rankSets[0][0];
var quartile = rankSets[1];
var delCount = 0;
var matchCount = 0;

var ndata = [];

function splice(data) {

  for (var i in data) {
    if (quartile.hasOwnProperty(data[i].url)) {
      // console.log('Deleting '+i+' '+data[i].url);
      ndata.push(data[i]);
      delCount++;
      i--;
      console.log('del '+i);
    } else {
      console.log(i);
      // console.log('----------------Keeping '+data[i].url);
    }
  }

  for (var i =0; i<ndata.length; i++) {
    for (var j=ndata.length-1; j>=0; j--) {
      if (data[j].url==data[i].url) {
        // console.log('j: '+j+' i: '+i);
        matchCount++;
        if (j!=i) {
          ndata.splice(j,1);
          j++;
        }
      }
    }
  }

  for (var i in ndata) {
    ndata[i].distance = 1;
  }

}

splice(dIn_1);
splice(dIn_2);

console.log(Object.keys(rankSets[0][0]).length);
console.log(Object.keys(rankSets[1]).length);
console.log('match count: '+matchCount);
console.log('data length: '+ndata.length);
console.log('deleted: '+delCount);

//
fs.writeFile('data/dups.json', JSON.stringify(dups), function(err) {
    if (err) {throw err;}
    console.log('dups written');
});

fs.writeFile('data/quantile-toCrawl.json', JSON.stringify(ndata), function(err) {
    if (err) {throw err;}
    console.log('quantile written');
});
