var request = require('request');
var fs = require('fs');
var d3 = require('d3');

// var in_d1d2 = JSON.parse(fs.readFileSync('data/prototypeData-d1-d2.json'));
var in_d1d2 = JSON.parse(fs.readFileSync('data/prototypeData-sample.json'));

var cleanStr = function(str) {
  return str.replace(/[^\w\s]/gi, '')
}

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
      if (mD!=null && mD.hasOwnProperty('instance of')) {

        // loop through instance of array
        // needs to track occurences so can not include n of 1
        for (var j in mD['instance of']) {

          group = mD['instance of'][j].split('\n')[0];

          if (!groups.hasOwnProperty(mD['instance of'][j])) {
            // add property, if new, and assign it an id
            groups[group] = {};
            groups[group].id = groupID;
            groups[group].count = 1;
            groupID++;
          } else {
            groups[group].count++;
          }

        } // end loop j
      }

    }
  } // end loop i

} // end function

getGroups(in_d1d2);
// getGroups(dada);

var groupsTrimmed = {};

function curateGroups() {

  for (var g in groups) {
    if (groups[g].count > 9) {
      groupsTrimmed[g] = groups[g];
    }
  }

}

curateGroups();
// console.log(groupsTrimmed);

// hash of urls with group as value
var urls = {};
var nullgroup = 999;
var links = [];

function getURLs(data, pointsAtDada) {

  for (var i in data) {

    if (data[i].hasOwnProperty('url')) {

      // console.log(data[i].root);

      // check if data has instanceOf in metaData
      if (!urls.hasOwnProperty(data[i].url)) {

        //need to modify this to be able to include title
        //make url property
        var earl = data[i].url;
        urls[earl] = {};

        //get group
        if (data[i].hasOwnProperty('metaData') && data[i].metaData!=null) {
          var mD = data[i].metaData;
          urls[earl].group = [];
          var human = false;

          if (mD.hasOwnProperty('instance of')) {
            for (var g in mD['instance of']) {
              var thisGroup = mD['instance of'][g].split('\n')[0];
              // test for human
              if (thisGroup=='human') { human = true; }
              // push to array
              urls[earl].group.push(groups[thisGroup].id);
            }

          } else {
            // set group equal to nullgroup / eg 'misc'
            urls[earl].group.push(nullgroup);
          }

          // get location data, if available
          for (var l in locationKeys) {
            if (mD.hasOwnProperty(locationKeys[l])) {
              urls[earl].location = mD[locationKeys[l]][0].split('\n')[0];
            }
          }

          // get date data, if available
          if (human) {
            if (mD.hasOwnProperty('date of birth')) { urls[earl].bdate = mD['date of birth'][0]; }
            if (mD.hasOwnProperty('date of death')) { urls[earl].ddate = mD['date of death'][0]; }
          } else {
            for (var d in dateKeys) {
              if (mD.hasOwnProperty(dateKeys[d])) {
                urls[earl].date = mD[dateKeys[d][0]];
              }
            }
          }

        } // end has wikiData

        if (data[i].title != undefined) {
          urls[earl].title = data[i].title;
        } else {
          urls[earl].title = data[i].url.slice(0, 15)+'...';
        }

        urls[earl].image = data[i].image;
        urls[earl].root = data[i].root;
        urls[earl].rank = data[i].rank;
        urls[earl].distance = data[i].distance;

        if (data[i].hasOwnProperty('roots')) {
          urls[earl].roots = [];
          for (var r in data[i].roots) {
            urls[earl].roots.push(cleanStr(data[i].roots[r]));
          }
        }


      }
    }
  }
}

// getURLs(dada, false);
getURLs(in_d1d2, false);
// console.log(urls);

var nodes;

function makeNodes(data) {
  // restructure data for force-directed-friendly node set
  nodes = d3.entries(data);

  for (var i in nodes) {
    nodes[i].id = cleanStr(nodes[i].key);
    delete nodes[i].key;
  }

}

makeNodes(urls);

var key = d3.entries(groupsTrimmed);
key.sort(function(a, b) {
    return parseFloat(b.value.count) - parseFloat(a.value.count);
});
console.log(key);

// console.log(key);
console.log(nodes.length);

// for each object in dataSet
function makeLinks(data) {

    for (var i in data) {

      if (data[i].hasOwnProperty('mapsTo')) {
        for (var j in data[i].mapsTo) {
            var link = {};
            link.source=cleanStr(data[i].url);
            link.target=cleanStr(data[i].mapsTo[j]);
            links.push(link);
            // console.log(link);
        }
      }

      if (data[i].hasOwnProperty('mapsFrom')) {
        for (var j in data[i].mapsFrom) {
          var link = {};
          link.target=cleanStr(data[i].url);
          link.source=cleanStr(data[i].mapsFrom[j]);
          links.push(link);
          // console.log(link);
        }
      }

    } // end i in data

}

makeLinks(in_d1d2);
// makeLinks(dada);

// console.log(links);
// console.log('links-length '+links.length);

var formattedData = {};
formattedData.nodes = nodes;
formattedData.links = links;
formattedData.groupKey = key;
//
var shortFormattedData = {}
shortFormattedData.nodes = nodes;
shortFormattedData.links = links.slice(0,10000);
shortFormattedData.groupKey = key;

fs.writeFile('data/forceChart-d2fullSet.json', JSON.stringify(formattedData), function(err) {
    if (err) {throw err;}
    console.log('forceChart fullSet written');
});

fs.writeFile('data/forceChart-sm.json', JSON.stringify(shortFormattedData), function(err) {
    if (err) {throw err;}
    console.log('sm written');
});
