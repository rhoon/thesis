var request = require('request');
var fs = require('fs');
var d3 = require('d3');

var pagesIn = JSON.parse(fs.readFileSync('quantile-toCrawl.json'));

var randomPages = d3.scaleLinear()
  .range([0, 374])
  .domain([0, 1])
  .clamp(true);

var ranRange = [];

for (var i=0; i<17; i++) {
  ranRange.push(parseInt(Math.floor(randomPages(Math.random()))));
}

console.log(ranRange);
var selection = [];

for (var r in ranRange) {
  selection.push(pagesIn[ranRange[r]]);
}

fs.writeFile('data/randomSample.json', JSON.stringify(selection), function(err) {
    if (err) {throw err;}
    console.log('random sample written');
});
