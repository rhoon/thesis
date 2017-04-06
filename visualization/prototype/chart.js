//
var margin = { top: 10, right: 10, bottom: 0, left: 0 };

var w = 2000 - margin.left - margin.right,
    h = 2000 - margin.top - margin.bottom;


d3.json('data/prototype-mapsFrom.json', drawChart);


function drawChart(data) {

  console.log(data);
  console.log(data.length);

  var chart = d3.select('div.chartBox')
          .append('svg')
          .attr('width', w)
          .attr('height', h);

  // calculate positions - assign each object an x / y attr
  chart.selectAll('circles')
    .data(data)
    .enter()
    .append('circle')
    .attrs({
      r: 5,
      cx: function(d) { return links(d)[0] },
      cy: function(d) { return links(d)[1] },
      fill: 'blue',
      opacity: .1
    })

  chart.selectAll('text.url')
    .data(data)
    .enter()
    .append('text')
    .attrs({
      x: function(d) { return links(d)[0] },
      y: function(d) { return links(d)[1] },
      class: 'url'
    })
    .text(function(d) { return d.url });

  chart.selectAll('text.data')
    .data(data)
    .enter()
    .append('text')
    .attrs({
      x: function(d) { return links(d)[0] },
      y: function(d) { return links(d)[1]+10 },
      class: 'url',
    })
    .text(function(d) { return links(d)[0]+' '+links(d)[1] });

  //  var clickInfo = d3.select('div.chartBox')

}

var ang = 0;
var c = [w/2, h/2]
var cPos = [1,1]

function links(d) {
  var mT = 0,
      mF = 0;
  if (d.hasOwnProperty('mapsTo')) {  mT = d.mapsTo.length; }
  if (d.hasOwnProperty('mapsFrom')) { mF = d.mapsFrom.length; }
  return [mT, mF];
}
