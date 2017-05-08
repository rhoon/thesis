function appendArticles(selection, distance) {
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
    }) // past this line just testing
    .text(function(d) { return d.value.title});

    var articleTitle = article
      .append('p')
      .classed('articleTitle', true)
      .text(function(d) { return d.value.title; })

    articleTitle.append('span')
      .classed('rank', true)
      .text(function(d) { return d.value.rank;});

    var articleImg = article
      .filter(function(d) {
        return (d.value.hasOwnProperty('image') && d.value.image!=null)
      })
      .append('div')
      .classed('imgBox', true)
      .append('img')
      .attrs({
        src: function(d) {return d.value.image},
        class: 'svgHoverImg'
      });
}
