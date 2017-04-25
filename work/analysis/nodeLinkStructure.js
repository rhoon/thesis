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

imgJunk = [
  "//upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Quill_and_ink.svg/25px-Quill_and_ink.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/9/99/Question_book-new.svg/50px-Question_book-new.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Padlock-silver.svg/20px-Padlock-silver.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/e/e7/Cscr-featured.svg/20px-Cscr-featured.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/0/06/Wiktionary-logo-v2.svg/40px-Wiktionary-logo-v2.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/f/f2/Edit-clear.svg/40px-Edit-clear.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/4/4a/Commons-logo.svg/30px-Commons-logo.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/9/94/Symbol_support_vote.svg/19px-Symbol_support_vote.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Text_document_with_red_question_mark.svg/40px-Text_document_with_red_question_mark.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/d/db/Symbol_list_class.svg/16px-Symbol_list_class.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ambox_important.svg/40px-Ambox_important.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Wikisource-logo.svg/12px-Wikisource-logo.svg.png",
  "//upload.wikimedia.org/wikipedia/en/thumb/6/6c/Wiki_letter_w.svg/40px-Wiki_letter_w.svg.png",
  "//upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Nuvola_apps_kdict.svg/40px-Nuvola_apps_kdict.svg.png"
]

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

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

getGroups(in_mapsTo);
getGroups(in_mapsFrom);
// console.log(groups);

var groupsTrimmed = {};

function curateGroups() {

  for (var g in groups) {
    if (groups[g].count > 5) {
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
          urls[earl].group = [];
          if (mD.hasOwnProperty('instance of')) {
            // set group equal to the first instance of
            // will want to refine this <--------------------------------
            // group = groups[mD['instance of'][0]];
            var human = false;
            for (var g in mD['instance of']) {
              var thisGroup = mD['instance of'][g].split('\n')[0];
              // test for human
              if (thisGroup=='human') { human = true; }
              // push to array
              // console.log(thisGroup);
              // console.log(groups[thisGroup].id);
              urls[earl].group.push(groups[thisGroup].id);
            }
            // console.log(urls[earl].group);

            // get dates; humans are different
            if (human) {
              if(mD.hasOwnProperty('date of birth')) {
                urls[earl].date = 'b.' + yearScrubber(mD['date of birth'][0]);
              }
              if(mD.hasOwnProperty( 'date of death')) {
                 urls[earl].date = urls[earl].date + ' d.' + yearScrubber(mD['date of death'][0])
               }
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

          // check for non-human date information
          for (var d in dateKeys) {
            if (mD.hasOwnProperty(dateKeys[d])) {
              // console.log('non human date'+mD[dateKeys[d]]);
              urls[earl].date = yearScrubber(mD[dateKeys[d]][0]);
            }
          }
        }

        if (data[i].title != undefined) {
          urls[earl].title = data[i].title;
        } else {
          urls[earl].title = data[i].url.slice(0, 15)+'...';
        }

        var isImgJunk = false;
        for (var ij in imgJunk) { if (data[i].image==imgJunk[ij]) { isImgJunk = true; } }
        if (!isImgJunk ) {  urls[earl].image = data[i].image; }

        urls[earl].root = data[i].root;

        //need to include some kind of 'distance' object

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
  }
  console.log(nodes[0]);
  //create dada node
  var dada = { id: 'Dada', value: { group: groupsTrimmed['art movement'], title: 'Dada', root: null, image: '//upload.wikimedia.org/wikipedia/en/thumb/2/2b/Francis_Picabia%2C_Dame%21_Illustration_for_the_cover_of_the_periodical_Dadaphone_n._7%2C_Paris%2C_March_1920.jpg/220px-Francis_Picabia%2C_Dame%21_Illustration_for_the_cover_of_the_periodical_Dadaphone_n._7%2C_Paris%2C_March_1920.jpg'}}
  nodes.push(dada);

}

makeNodes(urls);

var key = d3.entries(groupsTrimmed);
// console.log(key);
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
// console.log('links-length '+links.length);

var formattedData = {};
formattedData.nodes = nodes;
formattedData.links = links;
formattedData.groupKey = key;
//
var shortFormattedData = {}
shortFormattedData.nodes = nodes;
shortFormattedData.links = links.slice(0,5000);
shortFormattedData.groupKey = key;

fs.writeFile('data/forceChart.json', JSON.stringify(formattedData), function(err) {
    if (err) {throw err;}
    console.log('forceChart written');
});

fs.writeFile('data/forceChart-sm.json', JSON.stringify(shortFormattedData), function(err) {
    if (err) {throw err;}
    console.log('sm written');
});
