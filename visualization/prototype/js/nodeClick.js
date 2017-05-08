function nodeClick() {
  return function(d) {
  // clear old path back, if any
  d3.selectAll('line.clicked').classed('clicked', false);
  d3.selectAll('line.pathBack').classed('pathBack', false);

  // hide current viz
  // d3.select('#nav').styles({
  //   display: 'none',
  // });

  // call pathBack
  pathBack(d);

  // append stuff

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

    roots.forEach(function(root) {
      var rootWebSelect = 'line.'+root;
      d3.selectAll(rootWebSelect).classed('clicked', true);
    })

    //select these things
    roots.forEach(function(root) {

      //show direct path back
      var selector = 'line.'+d.id+'.'+root;
      d3.selectAll(selector)
        .classed('clicked', false)
        .classed('pathBack', true);

      // show path to dada
      if (d.value.distance>1) {
        var selector2 = 'line.'+root+'.Dada';
        d3.selectAll(selector2)
          .classed('clicked', false)
          .classed('pathBack', true);
      }

      // append labels


      console.log(selector);
    });
}

function showLines(selector, opacity, stroke) {
  d3.selectAll(selector).styles({
    'stroke-opacity': opacity,
    'stroke-width': 1,
    diplay: 'inline',
  });
}
