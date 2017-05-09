
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

function explore() {
  // hide intro
  var intro = d3.select('#intro');
  intro.transition().style('opacity', 0);
  // intro.style('display', 'none');
  // show sidebar
  var sidebar = d3.select('div#sidebar');
  d3.select('div#sidebar').style('display', 'block');
  d3.select('div#sidebar').transition().style('left', '0%');

}

// var silderVals = slider.noUiSlider.get();
// console.log(sliderVals);

function getDate(d) {
    var date = '';
    if (d.value.hasOwnProperty('date')) {
      date = d.value.date;
    }

    if (d.value.hasOwnProperty('bdate')) {
      date = 'b. '+d.value.bdate;
    }

    if (d.value.hasOwnProperty('ddate')) {
      date += ' d. '+d.value.ddate;
    }
    return date;
}

function formatRank(d) {
  return 'Rank: '+d.value.rank+'%';
}

function getLocation(d) {
  return (d.value.hasOwnProperty('location')) ? d.value.location : '';
}

function showDeets() {
  return function(d) {

    // console.log(d);
    var title = d.value.title,
        location = getLocation(d),
        date = getDate(d),
        rank = formatRank(d);

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
      });

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
      .html(' <br/> '+rank+' <br/> '+location+' <br/> '+date);

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
      return Math.ceil(+d.value.rank*100)*1.5+hover;
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

d3.json("data/forceChart-sm.json", function(error, graph) { //suffix: -d2fullSet
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

  var row2 = d3.select('#row_d2'),
      row1 = d3.select('#row_d1');

  appendArticles(row1, 1);
  appendArticles(row2, 2);

  function appendArticles(selection, distance) {

    // Article Body
    var article = selection
      .selectAll('div.article')
      .data(graph.nodes.filter(
        function(d) { return d.value.distance==distance; }
      ))
      .enter()
      .append('div')
      .attrs({
        class: 'article card',
        id: function(d) {
          return 'a_'+d.id;
        }
      });

      // append article Images
      var articleImg = article
        .filter(function(d) {
          return (d.value.hasOwnProperty('image') && d.value.image!=null)
        })
        .append('div')
        .classed('imgBox', true)
        .append('img')
        .attrs({
          src: function(d) {return d.value.image; },
          class: 'articleImg'
        });

      // append article Header
      var articleTitle = article
        .append('p')
        .classed('articleTitle', true)
        .text(function(d) { return d.value.title; })

      var articleBody = article
        .append('p')
        .classed('textLite', true)
        .html(function(d) {
          var date = getDate(d)+'<br/>';
          var location = (d.value.hasOwnProperty('location')) ? d.value.location+'<br/>' : '';
          var rank = formatRank(d)+'<br/>';
          return rank+location+date;
        });

      // append wiki link
      var wiki = article
        .append('a')
        .attrs({
          href: function(d) { return 'https://en.wikipedia.org/wiki/'+d.id; },
          target: 'new',
          class: 'wiki'
        })
        .text('Wiki');
  }

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

});
