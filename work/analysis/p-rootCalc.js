var request = require('request');
var fs = require('fs');
var d3 = require('d3');
var async = require('async');
var _ = require('lodash');

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
    console.log('DONE LOADING DATA');

      var i = 0,
          j = 0,
          k = 0;
          mapsToDone = false;
          mapsFromDone = false;
          jDone = false;

      // for (var c = 0; c<10; c++) {
      //   console.log('--------------------------------------');
      //   console.log('DATA');
      //   console.log(data[c]);
      //   console.log('--------------------------------------');
      //   console.log('D1');
      //   console.log(d1[c]);
      // }

      // for (var c in data) {
      //   if (data[c].hasOwnProperty('mapsFrom')) {
      //       for (var cc in data[c].mapsFrom) {
      //
      //         if (data[c].mapsFrom[cc]=='Dada') {
      //           console.log(data[c].url)
      //           console.log('MAPS FROM DADA');
      //           i++;
      //         }
      //       }
      //   }
      //   if (data[c].hasOwnProperty('mapsTo')) {
      //     for (var ccc in data[c].mapsTo) {
      //
      //       if (data[c].mapsTo[ccc]=='Dada')
      //     }
      //   }
      // }
      // console.log('MATCHES: '+i);
      // console.log('OUT OF: '+data.length);

      // recursiveLoop();
      function recursiveLoop() {

        data[i].roots = [];

        if (j < d1.length) {

          if (!mapsToDone && d1[j].hasOwnProperty('mapsTo')) {
              // check for matches in the 'mapsTo' array
              if (data[i].url == d1[j].mapsTo[k]) {
                console.log('MATCH'+data[i].url);
                // if they are a match, push the root URL
                data[i].roots.push(d1[j].url);
              }
              k++;
              if (k>=d1[j].mapsTo.length-1) {
                mapsToDone = true;
                k = 0;
              }
          } else {
              mapsToDone = true;
              k = 0;
          }

          if (mapsToDone) {
            // console.log('------------ J DONE '+j);
            mapsToDone = false;
            j++;
          }

        } else { //mapsFromDone &&
          console.log('------------------------I DONE '+i)
          console.log(data[i].roots);
          j = 0;
          i++;
          mapsFromDone = false;
          mapsToDone = false;
        }

        if (i<data.length-1) {
          setTimeout( function() {
            // console.log('k: '+k+' j: '+j+' i: '+i);
            recursiveLoop();
          }, 0);
        }

      }

      // fs.writeFile('data/d2-combined-roots.json', JSON.stringify(data), function(err) {
      //     if (err) {throw err;}
      //     console.log('d2-combined-roots written');
      // });

});


// for each url in data, locate matches in d1 mapsTo arrays
// async.eachSeries(data, function(d_item, callback_2) {
//
//   d_item.roots = [];
//   // console.log(data[i].url)
//   for (var j in d1) {
//     if (d1[j].hasOwnProperty('mapsTo')) {
//       for (var k in d1[j].mapsTo) {
//         if (d_item.url==d1[j].mapsTo[k]) {
//           d_item.roots.push(d1[j].url);
//           // console.log('match');
//         }
//       } // end loop k
//     }
//     if (d1[j].hasOwnProperty('mapsFrom')) {
//       for (var k in d1[j].mapsFrom) {
//         if (d_item.url==d1[j].mapsFrom[k]) {
//           d_item.roots.push(d1[j].url);
//         }
//       }
//     }
//   } // end loop j

  // callback_2;

// }, function() {
//   console.log(data.length);
// });
