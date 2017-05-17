var colorStrArr = ['lblu', 'oran', 'tgol', 'brow', 'blue', 'purp', 'ttea', 'gree'];

var svg = d3.select('svg')
    width = +svg.attr('width'),
    height = +svg.attr('height');

var zg = svg.append('g');

var slider = document.getElementById('slider-connect');

var percentileRank = d3.scaleLinear()
  .range([75, 100]) // we only show the top quartile
  .domain([0.001468, 0.114607]);

function explore() {

  // unselect links (disorienting)
  clearNodeClick()

  // hide intro
  var intro = d3.selectAll('div#intro, h1#dynamic');
    intro.transition().style('opacity', 0);
    intro.transition().delay(500).style('display', 'none');


  // show sidebar
  var sidebar = d3.select('div#sidebar');
    sidebar.style('display', 'block');
    sidebar.transition().style('left', '0%');

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

    date = (date=='') ? '' : date+'<br/>';
    return date;
}

function formatRank(d) {
  return 'Rank: '+Math.round(percentileRank(d.value.rank)*100)/100+'/100';
}

function getLocation(d) {
  return (d.value.hasOwnProperty('location')) ? d.value.location+'<br/>' : '';
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
      .html(' <br/> '+rank+' <br/> '+location+date);

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

    // d3.select('div.nodeDeets').remove();

    var circle = d3.select(this);

    circle.transition()
      .attrs({
        r: circleSize(0),
      });

  }
}

function toggler() {
  return function(d) {

    // new toggle
    var thisToggle = d3.select('div.toggle.g'+d.value);
    var theseCircles = d3.select('svg').selectAll('circle.g'+d.value);

    if (!thisToggle.classed('clicked')) {
      thisToggle.classed('clicked', true);
      theseCircles.classed('toggled '+colorStrArr[d.value%8], true);
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
      return 'toggle g'+d.value;
    })
    .text( function(d) { return d.key });

  // indicator
  toggle.append('input')
    .attrs({
      class: 'tgl tgl-light',
      id: function(d) { return 'g'+d.value; },
      type: 'checkbox'
    })
    .on('mouseup', toggler());

  toggle.append('label')
    .attrs({
      class: function(d) { return 'tgl-btn tgl-'+colorStrArr[d.value%8]; },
      for: function(d) { return 'g'+d.value; }
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
          var date = getDate(d);
          var location = (d.value.hasOwnProperty('location')) ? d.value.location+'<br/>' : '';
          if (location=='United States of America') {location='USA';}
          var rank = formatRank(d)+'<br/>';
          return rank+location+date;
        });

      // append wiki link
      var wiki = article
        .append('a')
        .attrs({
          href: function(d) { return 'https://en.wikipedia.org/wiki/'+d.url; },
          target: 'new',
          class: 'wiki'
        })
        .text('Wiki');
  }

  // force diagram
  var links = graph.links,
      nodes = graph.nodes,
      // meter = document.querySelector("#progress"),
      worker = new Worker("js/worker.js"),
      urlList = [],
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
    // meter.style.width = 100 * progress + "%";

    // would be nice to communicate a little here
    // 'loading dataset...'
    // 'drawing chart...'
  }

  function ended(data) {
    var nodes = data.nodes,
        links = data.links;
    console.log('done');
    d3.select('div.loader').style('display', 'none');
    // meter.style.display = "none";

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


    // Search - instantiated after data is loaded
    var dataList = d3.select("#titleList");

    var input = document.getElementById("search");

    dataList.selectAll('option')
      .data(titleList)
      .enter()
      .append('option')
      .attr('value', function(d) {
        return d;
      });

    // instantiate 'Awesomplete'
    new Awesomplete(input, {
      list: "#titleList",
      minChars: 3,
      maxItems: 10
    });

    document.getElementById('search')
      .addEventListener('awesomplete-selectcomplete',function(){

        // get selector from friendly text
        var id = titleList.indexOf(this.value);
        // create Event
        var event = document.createEvent("HTMLEvents");
        event.initEvent("click",true,false);
        document.getElementById(urlList[id]).dispatchEvent(event);

    });

    // call the animation loop
    // starterAnimation();

    // fade in the intro
    d3.selectAll('#intro, h1#dynamic').transition().style('opacity',1);

  }

});
