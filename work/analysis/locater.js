var request = require('request');
var fs = require('fs');
var d3 = require('d3');

var dataIn_1 = JSON.parse(fs.readFileSync('data/dada-mapsTo.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500-1700.json'));
var dataIn_3 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500.json'));

toFind = [
  '1912_in_poetry',
  '1882_in_poetry',
  'Theatre',
  'Art'
]

found = [];

function locator(data) {

  for (var i in data) {
    for (var j in toFind) {

      var seek = data[i].url;
      var find = toFind[j];

      if (find == seek) {
        console.log(data[i]);

        found.push(find);
        toFind.splice(j, 1);
        break;
      }

    }
  }

}

locator(dataIn_1);
locator(dataIn_2);
locator(dataIn_2);

console.log('Found at least one instance of: ');
console.log(found);
console.log('Did not find instances of: ');
console.log(toFind);
