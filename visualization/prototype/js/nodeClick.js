var lastClicked = null;

function clearLastClick() {

  // Reset network graph
  if (lastClicked!=null) { lastClicked.classed('gold opac_9', false); }
  d3.selectAll('circle.off').classed('off', false);
  d3.selectAll('line.clicked').classed('clicked', false);
  d3.selectAll('line.pathBack').classed('pathBack', false);
  d3.selectAll('div.smallLabel').remove();

  // Reset Article Styles
  d3.select('#downArrow').style('height', '10em');
  d3.selectAll('div.article.pathBack').attr('style', null);
  d3.select('div.article.selected').classed('selected', false);
  d3.select('div.article.current').classed('current', false);
  d3.selectAll('div.article.pathBack').classed('pathBack', false);
  d3.selectAll('div.article.rightSide').classed('rightSide', false);
  d3.selectAll('div.article.leftSide').classed('leftSide', false);
}

function rClick() {
  var rightSide1 = d3.select('div.article.rightSide');
  var current = d3.select('div.article.current');

  if (rightSide1._groups[0][0]!=null) {
    current.classed('current', false)
      .transition()
      .ease(d3.easeCubic)
      .style('left', '-76%');

    current.classed('leftSide', true);

    rightSide1.classed('rightSide', false)
      .transition()
      .ease(d3.easeCubic)
      .style('left', '10%');

    rightSide1.classed('current', true);
  }

}

function lClick() {
    var leftSide1 = d3.select('div.article.leftSide');
    var current = d3.select('div.article.current');

    if (leftSide1._groups[0][0]!=null) {
      current.classed('current', false)
        .transition()
        .ease(d3.easeCubic)
        .style('left', '96%');

      current.classed('rightSide', true);

      leftSide1.classed('leftSide', false)
        .transition()
        .ease(d3.easeCubic)
        .style('left', '10%');

      leftSide1.classed('current', true);
    }
}

function smallLabel(d, showDada) {

  var title = (d.value.title.length>20) ? d.value.title.slice(0, 15)+'...' : d.value.title,
      boxHeight = 25,
      dadaY = parseFloat(d3.select('circle#Dada').attr('cy')),
      dadaX = parseFloat(d3.select('circle#Dada').attr('cx'));

  var box = d3.select('div#chart')
    .append('div')
    .classed('smallLabel card', true)
    .attr('id', title+'Label')
    .text(title);

  // gets width of just appended box for positioning
  var offsetWidth = document.getElementById(title+'Label').offsetWidth;

  box.styles({
        left: function() {
          var xMod = (d.x < dadaX) ? -offsetWidth-10 : 10;
          return d.x+xMod+'px';
        },
        top: function() {
          var yMod = (d.y < dadaY) ? -boxHeight-10 : 10;
          return d.y+yMod+'px';
        },
        opacity: 0
      });

  // show dada box, position accordingly, if condition is met
  if (showDada) {

    var dadaBox = d3.select('div#chart')
      .append('div')
      .classed('smallLabel card', true)
      .attr('id', 'dadaLabel')
      .text('Dada');

    var dadaOffset = document.getElementById('dadaLabel').offsetWidth;

    dadaBox.styles({
      left: function() {
        var xMod = (d.x < dadaX) ? 10 : -dadaOffset-10;
        return dadaX+xMod+'px';
      },
      top: function() {
        var yMod = (d.y < dadaY) ? 10 : -boxHeight-10;
        return dadaY+yMod+'px';
      },
      opacity: 0
    });

  }

  box.transition().delay(500).style('opacity', 1);
  dadaBox.transition().delay(500).style('opacity', 1);

}

function zoom(d) { // add parameter d

  // zoom is functional but too slow due to number of objects
  var dadaX = parseFloat(d3.select('circle#Dada').attr('cx')),
      dadaY = parseFloat(d3.select('circle#Dada').attr('cy')),
      dims = [Math.abs(dadaX-d.x), Math.abs(dadaY-d.y)],
      centerX = (dadaX + d.x)/2;
      centerY = (dadaY + d.y)/2;

      d3.select('svg')
        .append('circle')
        .attr('fill', 'blue')
        .attr('r', 4)
        .attr('cx', centerX)
        .attr('cy', centerY);

  var scale = .3 / Math.max(dims[0] / width, dims[1] / height);
  translate = [width / 2 - scale * centerX, height / 2 - scale * centerY];

  g = d3.select('g');

  g.transition()
      .duration(2000)
      .style("stroke-width", 1.5 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

}


function nodeClick() {
  return function(d) {

  console.log(d);

  // zoom(d); - commented out, poor performance

  // title swapping - works but is overwhelmed (poor performance)
  // var o = d3.select('div#intro').style('opacity');
  // console.log(o);
  // if (o==1) {
  //   // this should actually just trigger a function
  //   replaceTitle(d);
  // }

  // clear old path back, if any
  clearLastClick();
  d3.selectAll('circle').classed('off', true);

  // highlightNode
  d3.select(this).classed('off', false);
  d3.select(this).classed('gold opac_9', true);
  lastClicked = d3.select(this);
  smallLabel(d, true);

  // highlight Dada
  d3.select('circle#Dada').classed('off', false);

  // call pathBack
  pathBack(d);

  // move routing in and nav out
  d3.select('#route')
    .transition()
    .styles({
      left: '0%',
      opacity: 1
    });

  d3.select('#nav')
    .transition()
    .styles({
      left: '-120%',
      opacity: 0
    });


  }
}

function pathBack(d) {

    // est roots array
    var roots;
    if (d.value.distance==1 || !d.value.hasOwnProperty('distance')) {
      roots = ['Dada'];
    } else {
      roots = d.value.roots;
    }

    // show all connected lines
    var webSelect = 'line.'+d.id;
    d3.selectAll(webSelect).classed('clicked', true);

    // show the clicked node's article
    var articleClicked = 'div#a_'+d.id;
    d3.select(articleClicked)
      .classed('pathBack selected', true);

    // show general network for each highlighted node
    roots.forEach(function(root) {
      var rootWebSelect = 'line.'+root;
      d3.selectAll(rootWebSelect).classed('clicked', true);
    })

    // highlight direct path lines
    roots.forEach(function(root) {

      // turn circles back on
      var circle = 'circle#'+root;
      d3.select(circle).classed('off', false);

      //show direct path back
      var selector = 'line.'+d.id+'.'+root;
      d3.selectAll(selector)
        .classed('clicked', false)
        .classed('pathBack', true);

      // if not directly connected to Dada, complete path
      if (d.value.distance>1) {
        var selector2 = 'line.'+root+'.Dada';
        d3.selectAll(selector2)
          .classed('clicked', false)
          .classed('pathBack', true);

        // make downArrow longer
        d3.select('#downArrow').style('height', '20em');

        // show current article
        var articleRoot = 'div#a_'+root;
        d3.select(articleRoot).classed('pathBack current', true);

        // if more than one root, move to the side
        if (roots.indexOf(root)>0) {
          d3.select(articleRoot)
            .classed('rightSide', true)
            .style('left', '96%');
        }

        //adjust back button placement
        d3.select('img.back').style('bottom', '10em');
      } else {
        d3.select('img.back').style('bottom', '0em');
      }

      // append labels
      // console.log(selector);
    });
    //
}

function showLines(selector, opacity, stroke) {
  d3.selectAll(selector).styles({
    'stroke-opacity': opacity,
    'stroke-width': 1,
    diplay: 'inline',
  });
}

function clearNodeClick() {

  clearLastClick();

  // move nav back in
  d3.select('#route')
    .transition()
    .styles({
      left: '-120%',
      opacity: 0
    });

  d3.select('#nav')
    .transition()
    .styles({
      left: '0%',
      opacity: 1
    });
}
