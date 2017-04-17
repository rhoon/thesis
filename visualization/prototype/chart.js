var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

d3.json("data/forceChart-sm-1.json", function(error, graph) {
  if (error) throw error;

  console.log(graph);

  var links = graph.links;
  var nodes = graph.nodes;

  var meter = document.querySelector("#progress");
  //     canvas = document.querySelector("canvas"),
  //     context = canvas.getContext("2d"),
  //     width = canvas.width,
  //     height = canvas.height;

  var worker = new Worker("worker.js");

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

    var link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', 1);

    var node = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 3)
      .attr('fill', 'blue');

    //positions
    link.attrs({
      x1: function(d) { return d.source.x; },
      y1: function(d) { return d.source.y; },
      x2: function(d) { return d.target.x; },
      y2: function(d) { return d.target.y; }
    })

    node.attrs({
      cx: function(d) { return d.x; },
      cy: function(d) { return d.y; }
    })

    node.append("title")
        .text(function(d) { return d.id; });

  }


});
