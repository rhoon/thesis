var request = require('request');
var fs = require('fs');
var d3 = require('d3');
// var nlp = require('compromise');
var rita = require('rita');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

var twohundoPlus = JSON.parse(fs.readFileSync('data/twohundoPlus.json'));

for (var i in twohundoPlus) {

  var spaced = twohundoPlus[i].replaceAll('_', ' ');
  var ri = rita.RiString(spaced);
  console.log(ri.features());

}


// var rs = rita.RiString("The elephant took a bite!");
// console.log(rs.features());

// console.log(rita);
