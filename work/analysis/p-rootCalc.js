var request = require('request');
var fs = require('fs');
var d3 = require('d3');
var async = require('async');
var _ = require('lodash');

var filenames = JSON.parse(fs.readFileSync('data/ec2-may7/filenames.json'));
var d1 = JSON.parse(fs.readFileSync('data/quantile-toCrawl.json'));

var data = [];
async.eachSeries(filenames, function(item, callback) {

    // item, array
    console.log(item);
    var file = JSON.parse(fs.readFileSync('data/ec2-may7/'+item))
    data = data.concat(file);
    setTimeout(callback, 0);

}, function() {
    console.log('DONE LOADING DATA');
    console.log(data.length);

    // for each url in data, locate matches in d1 mapsTo arrays
    async.eachSeries(data, function(d_item, d_cb) {
    // data.forEach(function(d_item) {

      d_item.roots = [];
      earl = d_item.url;
      // console.log(data[i].url)

      d1.forEach(function(item) {
        if (item.hasOwnProperty('mapsTo')) {
          var index = item.mapsTo.indexOf(earl);
          if (index!=-1) {
            d_item.roots.push(item.url);
          }
        }
        if (item.hasOwnProperty('mapsFrom')) {
          var index = item.mapsFrom.indexOf(earl);
          if (index!=-1) {
            d_item.roots.push(item.url);
          }
        }
     });

     d_item.roots = _.uniq(d_item.roots);
     setTimeout(d_cb, 0);

    }, function() {

        fs.writeFile('data/d2-sample-combined-roots.json', JSON.stringify(data), function(err) {
            if (err) {throw err;}
            console.log('d2-combined-roots written');
        });

    });
});
