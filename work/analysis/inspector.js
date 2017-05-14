var request = require('request');
var fs = require('fs');
var d3 = require('d3');

var data = JSON.parse(fs.readFileSync('data/prototypeData-sample.json'));

// console.log(data[0]);
locationKeys = [
  'coordinate location',
  'location',
  'sovereign state',
  'located in the administrative territorial entity',
  'country',
  'country of origin',
  'country of citizenship'
]

var humans = 0,
    occupationDist = {},
    gender = { male: 0, female: 0, na: 0, exc:[] }
    locationDist = {},
    birthYearDist = {},
    hasBirthYear = 0,
    noBirthYear = 0,
    deathYearDist = {},
    hasDeathYear = 0,
    noDeathYear = 0,
    catDist = {},
    noMetaData = 0,
    noInstanceOf = 0,
    mapsFromDist = {},
    mapsToDist = {};


for (var i in data) {

  if (data[i].hasOwnProperty('metaData') && data[i].metaData!=null) {
    // make meta var for easy access
    var meta = data[i].metaData,
        instance = meta['instance of'];

    //if instance contains the property 'human'
    if (instance!=undefined && instance.indexOf('human')!=-1) {
      // add one to the count of humans
      humans++;
      // get occupation info
      if (meta.hasOwnProperty('occupation')) {
        for (var o in meta['occupation']) {
          var occ = meta['occupation'][o].split('\n')[0];
          // console.log(occ);
          if (!occupationDist.hasOwnProperty(occ)) {
            occupationDist[occ] = 1;
          } else {
            occupationDist[occ]++;
          }
        }
      }

      // get gender information
      if (meta.hasOwnProperty('sex or gender')) {
        var g = meta['sex or gender'];
        if (g=='male') {
          gender.male++;
        } else if (g=='female') {
          gender.female++;
        } else {
          gender.exc.push(g[0]);
        }
      } else {
        gender.na++;
      }

      // get citizenshipsCounts - estimate, data is dirty
      for (var lk in locationKeys) {
        if (meta.hasOwnProperty(locationKeys[lk])) {
          var loc = meta[locationKeys[lk]];
          loc = loc[0].split('\n')[0];
          if(!locationDist.hasOwnProperty(loc)) {
            locationDist[loc]=1;
          } else {
            locationDist[loc]++;
          }
        }
      } //end locationKey loop

      // get birthYearDist by decade
      if (meta.hasOwnProperty('date of birth')) {
        var date = parseInt(meta['date of birth']);
        date = (Math.floor(date/10))*10;
        if (birthYearDist.hasOwnProperty(date)) {
          birthYearDist[date]++;
        } else {
          birthYearDist[date]=1;
        }
        hasBirthYear++;
      } else {
        noBirthYear++;
      }

      // get deathYear Dist by decade
      if (meta.hasOwnProperty('date of death')) {
        var date = parseInt(meta['date of death']);
        date = (Math.floor(date/10))*10;
        if (deathYearDist.hasOwnProperty(date)) {
          deathYearDist[date]++;
        } else {
          deathYearDist[date]=1;
        }
        hasDeathYear++;
      } else {
        noDeathYear++;
      }
    } // end if humans

    if (instance!=undefined) {

      for (var cat in instance) {
        var cleanCat = instance[cat].split('\n')[0];
        if (!catDist.hasOwnProperty(cleanCat)) {
          catDist[cleanCat]=1;
        } else {
          catDist[cleanCat]++;
        }

      }
    } else {
      noInstanceOf++;
    }


  } else {
    noMetaData++;
  }




}

occupationDist = d3.entries(occupationDist);
catDist = d3.entries(catDist);
locationDist = d3.entries(locationDist);
deathYearDist = d3.entries(deathYearDist);
birthYearDist = d3.entries(birthYearDist);

occupationDist.sort(function(a, b) {
    return parseFloat(b.value) - parseFloat(a.value);
});

catDist.sort(function(a, b) {
    return parseFloat(b.value) - parseFloat(a.value);
});

locationDist.sort(function(a, b) {
    return parseFloat(b.value) - parseFloat(a.value);
});

console.log('OCCUPATION COUNTS: '+occupationDist.length);
console.log(occupationDist);


console.log('CATEGORIES: '+catDist.length);
console.log(catDist);

console.log('LOCATIONS: '+locationDist.length);
console.log(locationDist);

console.log('DEATH YEAR DIST');
console.log(deathYearDist);

fs.writeFile('data/overview/deathYearDist.json', JSON.stringify(deathYearDist), function(err) {
    if (err) {throw err;}
    console.log('deathYearDist sample written');
});

console.log('BIRTH YEAR DIST');
console.log(birthYearDist);

fs.writeFile('data/overview/birthYearDist.json', JSON.stringify(birthYearDist), function(err) {
    if (err) {throw err;}
    console.log('birthYearDist sample written');
});

console.log('HUMAN COUNT')
console.log(humans);

console.log('HAVE DEATH YEAR DATA: '+hasDeathYear);
console.log('HAVE BIRTH YEAR DATA: '+hasBirthYear);
console.log(gender);

console.log('LIST LENGTH: '+data.length);
console.log('NO INSTANCE OF: '+noInstanceOf);
console.log('NO METADATA: '+noMetaData);
