function nodeClick(){return function(e){d3.selectAll("line.clicked").classed("clicked",!1),d3.selectAll("line.pathBack").classed("pathBack",!1),d3.selectAll("div.article.pathBack").classed("pathBack",!1),pathBack(e),d3.select("#route").transition().style("left","0"),d3.select("#nav").transition().style("left","-120%")}}function pathBack(e){var l;console.log(e),1!=e.value.distance&&e.value.hasOwnProperty("distance")?l=e.value.roots:(l=["Dada"],console.log(l));var c="line."+e.id;d3.selectAll(c).classed("clicked",!0);var a="div#a_"+e.id;d3.select(a).classed("pathBack",!0),l.forEach(function(e){var l="line."+e;d3.selectAll(l).classed("clicked",!0)}),l.forEach(function(l){var c="line."+e.id+"."+l;if(d3.selectAll(c).classed("clicked",!1).classed("pathBack",!0),e.value.distance>1){var a="line."+l+".Dada";d3.selectAll(a).classed("clicked",!1).classed("pathBack",!0);var s="div#a_"+l;d3.select(s).classed("pathBack",!0)}console.log(c)})}function showLines(e,l,c){d3.selectAll(e).styles({"stroke-opacity":l,"stroke-width":1,diplay:"inline"})}