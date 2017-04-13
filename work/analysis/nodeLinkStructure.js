var request = require('request');
var fs = require('fs');
var d3 = require('d3');

var in_mapsTo = JSON.parse(fs.readFileSync('data/prototype-mapsTo.json'));
var in_mapsFrom = JSON.parse(fs.readFileSync('data/prototype-mapsFrom.json'));

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

        //get group
        if (data[i].hasOwnProperty('metaData')) {
          var mD = data[i].metaData;
          var group;
          if (mD.hasOwnProperty('instance of')) {
            // set group equal to the first instance of
            // will want to refine this <--------------------------------
            group = groups[mD['instance of'][0]];
          } else {
            // set group equal to nullgroup
            group = nullgroup;
          }
        }

        //make url property
        urls[data[i].url] = group;

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

}

makeNodes(urls);
console.log(nodes.length);

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
console.log('links-length '+links.length);

var formattedData = {};
formattedData.nodes = nodes;
formattedData.links = links;
formattedData.groupKey = groups;

var shortFormattedData = {}
shortFormattedData.nodes = nodes;
shortFormattedData.links = links.slice(0,5000)

fs.writeFile('data/forceChart.json', JSON.stringify(formattedData), function(err) {
    if (err) {throw err;}
    console.log('forceChart written');
});

fs.writeFile('data/forceChart-sm.json', JSON.stringify(shortFormattedData), function(err) {
    if (err) {throw err;}
    console.log('sm written');
});
