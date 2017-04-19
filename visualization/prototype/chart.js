var svg = d3.select('svg'),
    width = +svg.attr('width'),
    height = +svg.attr('height');

var zg = svg.append('g');

function showDeets() {
  return function(d) {

    console.log(d);

    var label = d.id;
    // need the other data!
    var boxHeight = 50;
    var circle = d3.select(this);

    circle.transition()
      .attrs({
        r: 8
      });

    var box = d3.select('div#chart')
      .append('div')
      .attrs({
        class: 'nodeDeets',
      })
      .styles({
        left: d.x+25+'px',
        top: d.y-boxHeight+'px',  
        opacity: 0
      })

    box.append('p')
      .text(label);

    //delay box fade-in to avoid jumpiness
    box.transition()
      .style('opacity', 1);

  }
}

function hideDeets() {
  return function(d) {

    d3.select('div.nodeDeets').remove();

    var circle = d3.select(this);

    circle.transition()
      .attrs({
        r: 3
      });

  }
}

function pathBack() {
  return function(d) {

    // this function finds the optimal path back to dada
    // from the clicked element
    // using a 'd' value

    // checks d values of connected elements
    // finds the element(s) with the lowest d


  }
}

function toggler() {
  return function(d) {

    var thisToggle = d3.select('div.toggle.g'+d.value);
    var theseCircles = d3.select('svg').selectAll('circle.g'+d.value);

    if (!thisToggle.classed('clicked')) {
      thisToggle.classed('clicked', true);
      theseCircles.classed('toggled', true);
    } else {
      thisToggle.classed('clicked', false);
      theseCircles.classed('toggled', false);
    }


  }
}

d3.json("data/forceChart-sm.json", function(error, graph) {
  if (error) throw error;

  console.log(graph.groupKey);

  //filters
  var toggle = d3.select('#sidebar')
    .selectAll('div.toggle')
    .data(graph.groupKey)
    .enter()
    .append('div')
    .attr('class', function(d) {
      return 'toggle g'+d.value;
    })
    .text( function(d) { return d.key })
    .on('mouseup', toggler());

  //buttons coming soon...

  // force diagram
  var links = graph.links,
      nodes = graph.nodes
      meter = document.querySelector("#progress"),
      worker = new Worker("worker.js");

  worker.postMessage({
    nodes: nodes,
    links: links
  });

  worker.onmessage = function(event) {
    switch (event.data.type) {
      case "tick": return ticked(event.data);
      case "end": return ended(event.data);
    }
  };

  function ticked(data) {
    var progress = data.progress;
    meter.style.width = 100 * progress + "%";
  }

  function ended(data) {
    var nodes = data.nodes,
        links = data.links;

    meter.style.display = "none";

    console.log(nodes);
    console.log(links);

    var link = zg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attrs({
        r: 3,
        x1: function(d) { return d.source.x; },
        y1: function(d) { return d.source.y; },
        x2: function(d) { return d.target.x; },
        y2: function(d) { return d.target.y; },
      });

    var node = zg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attrs({
        r: 3,
        cx: function(d) { return d.x; },
        cy: function(d) { return d.y; },
        class: function(d) { return 'g'+d.group },
      })
      .on('mouseover', showDeets())
      .on('mouseout', hideDeets());

    node.append("title")
        .text(function(d) { return d.id; });

  }

  // https://github.com/d3/d3-zoom
  // need to greatly refine zoom
  // this puts a rectangle over entire visualization,
  // blocking access to hovers / circle clicks

  // svg.append("rect")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .style("fill", "none")
  //     .style("pointer-events", "all")
  //     .call(d3.zoom()
  //         .scaleExtent([1 / 2, 4])
  //         .on("zoom", zoomed));
  //
  // function zoomed() {
  //   zg.attr("transform", d3.event.transform);
  // }

});
