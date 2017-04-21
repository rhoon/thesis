var request = require('request');
var fs = require('fs');
var d3 = require('d3');

var in_mapsTo = JSON.parse(fs.readFileSync('data/prototype-mapsTo.json'));
var in_mapsFrom = JSON.parse(fs.readFileSync('data/prototype-mapsFrom.json'));

locationKeys = [
  'coordinate location',
  'location',
  'sovereign state',
  'located in the administrative territorial entity',
  'country',
  'country of origin',
  'country of citizenship'
]

dateKeys = [
  'publication date',
  'first performance',
  'inception'
]

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

dateJunk = [
  'Gregorian',
  'Julian',
  'instance',
  'sourcing',
  '\n',
  'earliest',
  'latest',
  'locationThéâtre',
  'place'
]

//goes through variety of string inputs, returns year
function yearScrubber(str) {
  var dateX = /\d\d\d\d/;
  var d;
  for (var j in dateJunk) {
    str = str.replaceAll(dateJunk[j], '');
  }
  var strs = str.split(' ');
  for (s in strs) {
    if (dateX.test(strs[s])) {
      d = strs[s];
      // console.log('DATE '+ d);
    }
  }
  return d;
}

// function
var groupID = 0;
var groups = {};
// need global count variable
function getGroups(data) {
  // cycle through urls, grab instanceOf properties
  for (var i in data) {
    if (data[i].hasOwnProperty('metaData')) {

      // select metaData
      var mD = data[i].metaData;
      if (mD.hasOwnProperty('instance of')) {

        // loop through instance of array
        for (var j in mD['instance of']) {
          if (!groups.hasOwnProperty(mD['instance of'][j])) {
            // add property, if new, and assign it an id
            groups[mD['instance of'][j]] = groupID;
            groupID++;
          }

        } // end loop j
      }

    }
  } // end loop i

} // end function

getGroups(in_mapsTo);
getGroups(in_mapsFrom);
// console.log(groups);

// hash of urls with group as value
var urls = {};
var nullgroup = 999;
var links = [];

function getURLs(data, pointsAtDada) {

  for (var i in data) {

    if (data[i].hasOwnProperty('url')) {

      var link = {};

      if (pointsAtDada) {
        // commit url to dadaLinks as src and Dada as target
        link.source = data[i].url;
        link.target = 'Dada';
      } else {
        // commit url
        link.source = 'Dada';
        link.target = data[i].url;
      }

      links.push(link);

      // check if data has instanceOf in metaData
      if (!urls.hasOwnProperty(data[i].url)) {

        //need to modify this to be able to include title
        //make url property
        var earl = data[i].url;
        urls[earl] = {};

        //get group
        if (data[i].hasOwnProperty('metaData')) {
          var mD = data[i].metaData;
          var group;
          if (mD.hasOwnProperty('instance of')) {
            // set group equal to the first instance of
            // will want to refine this <--------------------------------
            group = groups[mD['instance of'][0]];

            // get dates; humans are different
            if (mD['instance of']=='human') {
              if(mD.hasOwnProperty('date of birth')) {
                urls[earl].date = 'b.' + yearScrubber(mD['date of birth'][0]);
              }
              if(mD.hasOwnProperty( 'date of death')) {
                 urls[earl].date = urls[earl].date + ' d.' + yearScrubber(mD['date of death'][0])
               }
            }
          } else {
            // set group equal to nullgroup
            group = nullgroup;
          }

          // get location data, if available
          for (var l in locationKeys) {
            if (mD.hasOwnProperty(locationKeys[l])) {
              urls[earl].location = mD[locationKeys[l]][0];
              console.log(urls[earl].location);
            }
          }


          // check for non-human date information
          for (var d in dateKeys) {
            if (mD.hasOwnProperty(dateKeys[d])) {
              // console.log('non human date'+mD[dateKeys[d]]);
              urls[earl].date = yearScrubber(mD[dateKeys[d]][0]);
            }
          }



        }

        urls[earl].group = group;
        urls[earl].title = data[i].title;
        urls[earl].image = data[i].image;
        urls[earl].root = data[i].root;
        // console.log(urls[earl]);



      }
    }
  }
}

getURLs(in_mapsTo, true);
getURLs(in_mapsFrom, false);
// console.log(urls);

var nodes;

function makeNodes(data) {
  // restructure data for force-directed-friendly node set
  nodes = d3.entries(data);

  for (var i in nodes) {
    nodes[i].id = nodes[i].key;
    delete nodes[i].key;
    nodes[i].group = nodes[i].value;
    delete nodes[i].value;
  }

  //create dada node
  var dada = { id: 'Dada' }
  nodes.push(dada);

}

// makeNodes(urls);


// console.log(urls);
// var key = d3.entries(groups);
// console.log(key);
// console.log(nodes.length);

// for each object in dataSet
function makeLinks(data) {

    for (var i in data) {

      if (data[i].hasOwnProperty('mapsTo')) {
        for (var j in data[i].mapsTo) {
            var link = {};
            link.source=data[i].url;
            link.target=data[i].mapsTo[j];
            links.push(link);
            // console.log(link);
        }
      }

      if (data[i].hasOwnProperty('mapsFrom')) {
        for (var j in data[i].mapsFrom) {
          var link = {};
          link.target=data[i].url;
          link.source=data[i].mapsFrom[j];
          links.push(link);
          // console.log(link);
        }
      }

    } // end i in data

}

makeLinks(in_mapsTo);
makeLinks(in_mapsFrom);

// console.log(links);
// console.log('links-length '+links.length);

// var formattedData = {};
// formattedData.nodes = nodes;
// formattedData.links = links;
// formattedData.groupKey = key;
//
// var shortFormattedData = {}
// shortFormattedData.nodes = nodes;
// shortFormattedData.links = links.slice(0,5000);
// shortFormattedData.groupKey = key;

// fs.writeFile('data/forceChart.json', JSON.stringify(formattedData), function(err) {
//     if (err) {throw err;}
//     console.log('forceChart written');
// });
//
// fs.writeFile('data/forceChart-sm.json', JSON.stringify(shortFormattedData), function(err) {
//     if (err) {throw err;}
//     console.log('sm written');
// });
