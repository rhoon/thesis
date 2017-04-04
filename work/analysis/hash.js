var request = require('request');
var fs = require('fs');
var d3 = require('d3');

var dataIn_1 = JSON.parse(fs.readFileSync('data/dada-mapsTo.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500-1700.json'));
var dataIn_3 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500.json'));

hash = {};
countTotal = 0;
countIndy = 0;
count_bad3 = 0;

function hashBuilder(data) {

    for (var i in data) {

      if (data[i].hasOwnProperty('mapsTo')) {
        var mapsTo = data[i].mapsTo;

        for (var j in mapsTo) {
          if (!hash.hasOwnProperty(mapsTo[j])) {
              hash[mapsTo[j]] = 1;
              countTotal++;
              countIndy++;
          } else {
              hash[mapsTo[j]] += 1;
              countTotal++;

          }
        } //end mapsTo loop
      } //end if mapsTo

      if(data[i].hasOwnProperty('mapsFrom')) {
        var mapsFrom = data[i].mapsFrom;

        for (var j in mapsFrom) {
          if (!hash.hasOwnProperty(mapsFrom[j])) {
            hash[mapsFrom[j]] = 1;
            countTotal++;
            countIndy++;
          } else {
            hash[mapsFrom[j]] += 1;
            countTotal++;

          } //end hash if
        } //end mapsFrom loop

      } //end mapsFrom if

    }

}

hashBuilder(dataIn_1);
hashBuilder(dataIn_2);
hashBuilder(dataIn_3);

console.log(hash);
console.log(countTotal);
console.log(countIndy);
console.log(count_bad3);

fs.writeFile('data/hash.json', JSON.stringify(hash), function(err) {
    if (err) {throw err;}
    console.log('file written');
});
