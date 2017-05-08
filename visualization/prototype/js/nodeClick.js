function nodeClick() {
  return function(d) {
  // clear old path back, if any
  d3.selectAll('line.clicked').classed('clicked', false);
  d3.selectAll('line.pathBack').classed('pathBack', false);
  d3.selectAll('div.article.pathBack').classed('pathBack', false);
  // d3.selectAll('')

  // hide current viz
  // d3.select('#nav').styles({
  //   display: 'none',
  // });

  // call pathBack
  pathBack(d);

  // move routing in
  d3.select('#route').transition().style('left', '0');
  d3.select('#nav').transition().style('left', '-120%');

  // zoom in

  }
}

function pathBack(d) {

    var roots;
    console.log(d);
    if (d.value.distance==1 || !d.value.hasOwnProperty('distance')) {
      roots = ['Dada'];
      console.log(roots);
    } else {
      roots = d.value.roots;
    }

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

        var articleRoot = 'div#a_'+root;
        d3.select(articleRoot).classed('pathBack', true);
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
