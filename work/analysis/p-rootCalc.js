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
          // async.eachSeries(data, function(d_item, callback_2) {
          for (var i in data) {

            data[i].roots = [];
            earl = data[i].url;
            // console.log(data[i].url)
            for (var j in d1) {
              if (d1[j].hasOwnProperty('mapsTo')) {

                // if d1[j].mapsTo has this url
                var index = d1[j].mapsTo.indexOf(earl);
                if (index!=-1) {
                  // make it a root
                  data[i].roots.push(d1[j].mapsTo[index]);
                  // console.log('match!');
                  // console.log(data[i].url);
                  // console.log(d1[j].url);

                }
              }
              if (d1[j].hasOwnProperty('mapsFrom')) {
                var index = d1[j].mapsFrom.indexOf(earl);
                if (index!=-1) {
                  data[i].roots.push(d1[j].mapsFrom[index]);
                }
              }
            } // end loop j

        // console.log(data[i].url);
        // console.log(data[i].roots.length);
        }

      fs.writeFile('data/d2-sample-combined-roots.json', JSON.stringify(data), function(err) {
          if (err) {throw err;}
          console.log('d2-combined-roots written');
      });

});
