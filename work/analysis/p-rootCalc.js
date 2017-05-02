var request = require('request');
var fs = require('fs');
var d3 = require('d3');
var async = require('async');

var filenames = JSON.parse(fs.readFileSync('data/ec2-d2-scrape/filenames.json'));
var mF1 = JSON.parse(fs.readFileSync('data/mapsFrom_Crawl.json'));
var mT1 = JSON.parse(fs.readFileSync('data/mapsTo_Crawl.json'));

var d1 = mF1.concat(mT1);



var data = [];
async.eachSeries(filenames, function(item, callback) {

    // item, array
    item = item.slice(5, item.length);
    var file = JSON.parse(fs.readFileSync('data/ec2-d2-scrape/'+item))
    data = data.concat(file);
    setTimeout(callback, 0);

}, function() {
    console.log('DONE');

    // for each url in data, locate matches in d1 mapsTo arrays
    for (var i in data) {
      data[i].roots = [];
      // console.log(data[i].url)
      for (var j in d1) {
        if (d1[j].hasOwnProperty('mapsTo')) {
          for (var k in d1[j].mapsTo) {
            if (data[i].url==d1[j].mapsTo[k]) {
              data[i].roots.push(d1[j].mapsTo[k]);
              // console.log('match');
            }
          } // end loop k
        }
      } // end loop j
      console.log(data[i].url);
      console.log(data[i].root);
      console.log(data[i].root.length);
    } // end loop i

    console.log(data.length);

    fs.writeFile('data/d2-combined-roots.json', JSON.stringify(data), function(err) {
        if (err) {throw err;}
        console.log('d2-combined-roots written');
    });

});
