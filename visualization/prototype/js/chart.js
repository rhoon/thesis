
var svg = d3.select('svg')
    width = +svg.attr('width'),
    height = +svg.attr('height');

var zg = svg.append('g');

var slider = document.getElementById('slider-connect');

noUiSlider.create(slider, {
  start: [1500,2018],
  connect: [false, true, false],
  range: {
    'min': 1500,
    'max': 2018
  },
});

var sVals;

slider.noUiSlider.on('update', function() {
  sVals = slider.noUiSlider.get();
  d3.select('span#s0').text(Math.floor(sVals[0]));
  d3.select('span#s1').text(Math.ceil(sVals[1]));
})



// var silderVals = slider.noUiSlider.get();
// console.log(sliderVals);

function getDate(d) {
    var date = '';
    if (d.value.hasOwnProperty('date')) {
      date = d.value.date;
    }

    if (d.value.hasOwnProperty('bdate')) {
      date = 'b'+d.value.bdate;
    }

    if (d.value.hasOwnProperty('ddate')) {
      date += 'd'+d.value.ddate;
    }
    return date;
}

function showDeets() {
  return function(d) {

    // console.log(d);
    var title = d.value.title,
        location = (d.value.hasOwnProperty('location')) ? d.value.location : '',
        date = getDate(d),
        group = 'Rank: '+d.value.rank+'%';
        console.log(date);

    // need the other data!
    var boxHeight = 50;
    var circle = d3.select(this);

    circle.transition()
      .attrs({
        r: circleSize(4)
      });

    var box = d3.select('div#chart')
      .append('div')
      .attrs({
        class: 'nodeDeets card',
      })
      .styles({
        left: d.x+25+'px',
        top: d.y-boxHeight+'px',
        opacity: 0
      })

    if (d.value.hasOwnProperty('image') && d.value.image!=null) {
      box.append('div')
        .classed('imgBox', true)
        .append('img')
        .attrs({
          src: d.value.image,
          class: 'svgHoverImg'
        });
    }

    box.append('p')
      .text(title)
      .append('span')
      .classed('details', true)
      .html(' <br/> '+group+' <br/> '+location+' <br/> '+date);

    //delay box fade-in to avoid jumpiness
    box.transition()
      .style('opacity', 1);

  }
}

function circleSize(hover) {
  return function(d) {
    if (d.id=='Dada') {
      return 5+hover;
    } else {
      return Math.ceil(+d.value.rank*100)*2+hover;
    }
  }
}

function hideDeets() {
  return function(d) {

    d3.select('div.nodeDeets').remove();

    var circle = d3.select(this);

    circle.transition()
      .attrs({
        r: circleSize(0),
      });

  }
}

function nodeClick() {
  return function(d) {
  // hide stuff
  console.log('CLICK');

  d3.select('#nav').styles({
    display: 'none',
  });

  // call pathBack
  pathBack(d);

  // append stuff

  // zoom in

  }
}

function pathBack(d) {

    var roots,
        isMany = false;

    console.log(d);
    if (d.value.distance==1 || !d.value.hasOwnProperty('distance')) {
      roots = ['Dada'];
      console.log(roots);
    } else {
      // doesn't scale past d2
      isMany = true;
      roots = d.value.roots;
    }

    //select these things
    // for (var i in roots) {
      //construct selector
    var selector = 'line.'+d.id; //'.'+roots[i]+' .'+d.id
    d3.selectAll(selector).styles({
      'stroke-opacity': .2,
      display:'inline',
    })
    console.log(selector);
    // }


    // return [id, isMany];

    // perhaps links have clases with source and root names for easy selection
    // e.g. var path = d3.select('line.'+source+'.'+root)
    // if distance = 1, highlight link going to dada
    // if distance = 2, loop through roots array
    //    for each id, select that node, highlight (use id)
    //        highlight link to root node
    //        link : source this target root OR
    //        link : source root target dada

    //    for each node, highlight it's path to dada
    //        link : target Dada source this OR
    //        link : target this source Dada

}

function toggler() {
  return function(d) {
    var thisToggle = d3.select('div.toggle.g'+d.value.id);
    var theseCircles = d3.select('svg').selectAll('circle.g'+d.value.id);

    if (!thisToggle.classed('clicked')) {
      thisToggle.classed('clicked', true);
      theseCircles.classed('toggled', true);
    } else {
      thisToggle.classed('clicked', false);
      theseCircles.classed('toggled', false);
    }
  }
}

d3.json("data/forceChart-d2fullSet-classes.json", function(error, graph) { //suffix: -d2fullSet
  if (error) throw error;

  //filters
  var toggle = d3.select('#catBox')
    .selectAll('div.toggle')
    .data(graph.groupKey)
    .enter()
    .append('div')
    .attr('class', function(d) {
      return 'toggle g'+d.value.id;
    })
    .text( function(d) { return d.key });

  // indicator
  toggle.append('input')
    .attrs({
      class: 'tgl tgl-light',
      id: function(d) { return 'g'+d.value.id; },
      type: 'checkbox'
    })
    .on('mouseup', toggler());

  toggle.append('label')
    .attrs({
      class: 'tgl-btn',
      for: function(d) { return 'g'+d.value.id; }
    })
    .on('mouseup', toggler());

  //buttons coming soon...

  // force diagram
  var links = graph.links,
      nodes = graph.nodes
      meter = document.querySelector("#progress"),
      worker = new Worker("js/worker.js");
      urlList = [];
      titleList = [];

  // make the URL list for the jquery search
  for (var n in nodes) {
      urlList.push(nodes[n].id);
      titleList.push(nodes[n].value.title);
  }

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
        x1: function(d) { return d.source.x; },
        y1: function(d) { return d.source.y; },
        x2: function(d) { return d.target.x; },
        y2: function(d) { return d.target.y; },
        class: function(d) { return d.source.id+' '+d.target.id}
      });

    var node = zg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attrs({
        r: circleSize(0),
        cx: function(d) { return d.x; },
        cy: function(d) { return d.y; },
        class: function(d) {
          var classes = '';
          for (var i in d.value.group) {
            classes = classes+' g'+d.value.group[i];
          }
          return classes;
        },
        id: function(d) {
          return d.id;
        }
      })
      .on('mouseover', showDeets())
      .on('mouseout', hideDeets())
      .on('click', nodeClick());

    // node.append("title")
    //     .text(function(d) { return d.id; });


    $( function() {
        // var availableTags = ;

        $( "#search" ).autocomplete({
          source: titleList,
        });
      } );

  }

  // https://github.com/d3/d3-zoom
  // http://bl.ocks.org/linssen/7352810
  // need to greatly refine zoom
  // this puts a rectangle over entire visualization,
  // blocking access to hovers / circle clicks
  //      - may need to be able to toggle it?
  //      - alternatively, would work just fine if relies
  //      - on buttons rather than mouse events


  // svg.append("rect")
  //     .attr("width", width)
  //     .attr("height", height)
  //     .style("fill", "none")
  //     .style("pointer-events", "all")
  //     .attr("id", "zoomRect")
  //     .call(d3.zoom()
  //         .scaleExtent([1 / 2, 4])
  //         .on("zoom", zoomed));
  //
  // function zoomed() {
  //   zg.attr("transform", d3.event.transform);
  // }
  //
  // d3.select("zIn")
  //     .on("click", zoomed);
  //
  //   function resetted() {
  //     svg.transition()
  //         .duration(750)
  //         .call(zoom.transform, d3.zoomIdentity);
  //   }

  // var zoom = d3.behavior.zoom()
  //   .x(x)
  //   .y(y)
  //   .scaleExtent([1, 10])
  //   .center([width / 2, height / 2])
  //   .size([width, height]);
  //   //.on("zoom", zoomed);
  //
  // svg.call(zoom);
  //
  // d3.selectAll("div#zIn")
  //     .on("click", function() {
  //       clicked;
  //       console.log('clicked');
  // });
  //
  // function clicked() {
  //   svg.call(zoom.event); // https://github.com/mbostock/d3/issues/2387
  //
  //   // Record the coordinates (in data space) of the center (in screen space).
  //   var center0 = zoom.center(), translate0 = zoom.translate(), coordinates0 = coordinates(center0);
  //   zoom.scale(zoom.scale() * Math.pow(2, +this.getAttribute("data-zoom")));
  //
  //   // Translate back to the center.
  //   var center1 = point(coordinates0);
  //   zoom.translate([translate0[0] + center0[0] - center1[0], translate0[1] + center0[1] - center1[1]]);
  //
  //   svg.transition().duration(750).call(zoom.event);
  // }
  //
  //   function coordinates(point) {
  //     var scale = zoom.scale(), translate = zoom.translate();
  //     return [(point[0] - translate[0]) / scale, (point[1] - translate[1]) / scale];
  //   }
  //
  //   function point(coordinates) {
  //     var scale = zoom.scale(), translate = zoom.translate();
  //     return [coordinates[0] * scale + translate[0], coordinates[1] * scale + translate[1]];
  //   }


});
