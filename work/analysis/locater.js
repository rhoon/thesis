var request = require('request');
var fs = require('fs');
var d3 = require('d3');

// var dataIn_1 = JSON.parse(fs.readFileSync('data/dada-mapsTo.json'));
// var dataIn_2 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500-1700.json'));
// var dataIn_3 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500.json'));

var dataIn_4 = JSON.parse(fs.readFileSync('data/forceChart-sm.json'));
var dataIn_5 = JSON.parse(fs.readFileSync('data/forceChart.json'));

toFind = [
  'wiktionary.org',
  'Dada'
]

found = [];

function locator(data) {

  for (var i in data) {
    for (var j in toFind) {

      var seek = data[i].id;
      var find = toFind[j];

      if (seek.includes(find)) {
        console.log(data[i]);

        found.push(find);
        toFind.splice(j, 1);
        break;
      }

    }
  }

}

locator(dataIn_4);
locator(dataIn_5);

console.log('Found at least one instance of: ');
console.log(found);
console.log('Did not find instances of: ');
console.log(toFind);
