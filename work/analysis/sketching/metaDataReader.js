var request = require('request');
var fs = require('fs');
var d3 = require('d3');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

//load urls with counts above 100
var toFind = JSON.parse(fs.readFileSync('data/hundoPlus.json'));

//load data
var dataIn_1 = JSON.parse(fs.readFileSync('data/dada-mapsTo.json'));
var dataIn_2 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500-1700.json'));
var dataIn_3 = JSON.parse(fs.readFileSync('data/dada-mapsFrom-batch1500.json'));

//counts and found
found = [];
countNoInst = 0;
countNoMetaData = 0;
hash = {};

//finding objects with matching urls
function locator(data) {

  for (var i in data) {
    for (var j in toFind) {

      var seek = data[i].url;
      var find = toFind[j];

      if (find == seek) {
        // console.log(find);
        if (data[i].hasOwnProperty('metaData')) {
          if (data[i].metaData.hasOwnProperty('instance of')) {
            var i_of = data[i].metaData['instance of'];
            if (!hash.hasOwnProperty(i_of)) {
                hash[i_of] = 1;
              } else {
                hash[i_of] += 1;
              }
            // console.log(i_of);
          } else {
            //track how many urls don't have 'instance of'
            // console.log('no "instance of" property');
            countNoInst++;
          }

        // track how many urls don't have metadata
        } else {
          console.log('no metaData');
          countNoMetaData++;
        }

        //add found urls to found, remove them from toFind
        found.push(find);
        toFind.splice(j, 1);
        break;
      }

    }
  }

}

locator(dataIn_1);
locator(dataIn_2);
locator(dataIn_3);



console.log('found '+found.length+' links');
console.log('urls with metaData but no "instance of" property: '+countNoInst);
console.log('urls with no metaData object: '+countNoMetaData);
console.log('Did not find '+toFind.length+' URLs: ');
console.log(toFind);

console.log(hash);
