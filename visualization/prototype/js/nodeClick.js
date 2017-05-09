var lastClicked = null;

function clearLastClick() {
  if (lastClicked!=null) { lastClicked.classed('gold', false); }
  d3.select('#downArrow').style('height', '10em');
  d3.selectAll('circle.off').classed('off', false);
  d3.selectAll('line.clicked').classed('clicked', false);
  d3.selectAll('line.pathBack').classed('pathBack', false);
  d3.selectAll('div.article.pathBack').classed('pathBack', false);
  d3.selectAll('div.article.rightSide').classed('rightSide', false);
  d3.selectAll('div.smallLabel').remove();
}

function smallLabel(d) {

  var title = (d.value.title.length>20) ? d.value.title.slice(0, 15)+'...' : d.value.title,
      boxHeight = 25,
      xMod = (d.x>width/2) ? 15 : -120;
  var box = d3.select('div#chart')
    .append('div')
    .classed('smallLabel card', true)
    .styles({
      left: d.x+xMod+'px',
      top: d.y-boxHeight+'px',
      opacity: 0
    })
    .text(title);

  box.transition().delay(500).style('opacity', 1);

}


function nodeClick() {
  return function(d) {

  // clear old path back, if any
  clearLastClick();

  d3.selectAll('circle').classed('off', true);

  // highlightNode
  d3.select(this).classed('off', false);
  d3.select(this).classed('gold', true);
  lastClicked = d3.select(this);
  smallLabel(d);

  // highlight Dada
  d3.select('circle#Dada').classed('off', false);

  // call pathBack
  pathBack(d);

  // move routing in and nav out
  d3.select('#route').transition().style('left', '0%');
  d3.select('#nav').transition().style('left', '-120%');

  // programmatic zoom (not functional)

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
    d3.select(articleClicked).classed('pathBack', true);

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
        d3.select(articleRoot).classed('pathBack', true);

        // if more than one root, move to the side
        if (roots.indexOf(root)>0) {
          d3.select(articleRoot).classed('rightSide', true);
        }

        //adjust back button placement
        d3.select('img.back').style('bottom', '10em');
      } else {
        d3.select('img.back').style('bottom', '0em');
      }

      // append labels
      console.log(selector);
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
  console.log('clear node click');
  clearLastClick();
  // move nav back in
  d3.select('#route').transition().style('left', '-120%');
  d3.select('#nav').transition().style('left', '0%');
}
