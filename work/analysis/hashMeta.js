var request = require('request');
var fs = require('fs');
var d3 = require('d3');

var hash = JSON.parse(fs.readFileSync('data/hash.json'));

count = 0;
twoPlus = [];
fivePlus = [];
tenPlus = [];
twentyPlus = [];
fiftyPlus = [];
hundoPlus = [];
twohundoPlus = [];
threehundoPlus = [];
fivehundoPlus = [];

for (var i in hash) {
      if (hash.hasOwnProperty(i)) {
        // console.log(hash[i]);
        if(hash[i]>=2) {
          twoPlus.push(i);
        }

        if(hash[i]>=5) {
          fivePlus.push(i);
        }

        if(hash[i]>=10) {
          tenPlus.push(i);
        }

        if(hash[i]>=20) {
          twentyPlus.push(i);
        }

        if(hash[i]>=50) {
          fiftyPlus.push(i);
        }

        if(hash[i]>=100) {
          hundoPlus.push(i);
        }

        if(hash[i]>=200) {
          twohundoPlus.push(i);
        }

        if(hash[i]>=300) {
          threehundoPlus.push(i);
        }

        if(hash[i]>=500) {
          fivehundoPlus.push(i);
        }

        count++;
      }
}

console.log('has any links: '+count)
console.log('more than 2 links: '+twoPlus.length);
console.log('more than 5 links: '+fivePlus.length);
console.log('more than 10 links: '+tenPlus.length);
console.log('more than 20 links: '+twentyPlus.length);
console.log('more than 50 links: '+fiftyPlus.length);
console.log('more than 100 links: '+hundoPlus.length);
console.log('more than 200 links: '+twohundoPlus.length);
console.log('more than 300 links: '+threehundoPlus.length);
console.log(threehundoPlus);
console.log('more than 500 links: '+fivehundoPlus.length);
console.log(fivehundoPlus);

fs.writeFile('data/hundoPlus.json', JSON.stringify(hundoPlus), function(err) {
    if (err) {throw err;}
    console.log('file written');
});
