function clearLastClick(){null!=lastClicked&&lastClicked.classed("gold opac_9",!1),d3.select("#downArrow").style("height","10em"),d3.selectAll("circle.off").classed("off",!1),d3.selectAll("line.clicked").classed("clicked",!1),d3.selectAll("line.pathBack").classed("pathBack",!1),d3.selectAll("div.article.pathBack").classed("pathBack",!1),d3.selectAll("div.article.rightSide").classed("rightSide",!1),d3.selectAll("div.smallLabel").remove()}function rClick(){var e=d3.select("div.article.rightSide"),l=d3.select("div.article.current");null!=e._groups[0][0]&&(l.classed("current",!1).transition().ease(d3.easeCubic).style("left","-76%"),l.classed("leftSide",!0),e.classed("rightSide",!1).transition().ease(d3.easeCubic).style("left","10%"),e.classed("current",!0))}function lClick(){var e=d3.select("div.article.leftSide"),l=d3.select("div.article.current");null!=e._groups[0][0]&&(l.classed("current",!1).transition().ease(d3.easeCubic).style("left","96%"),l.classed("rightSide",!0),e.classed("leftSide",!1).transition().ease(d3.easeCubic).style("left","10%"),e.classed("current",!0))}function smallLabel(e){var l=e.value.title.length>20?e.value.title.slice(0,15)+"...":e.value.title,t=25,c=e.x>width/2?15:-120;d3.select("div#chart").append("div").classed("smallLabel card",!0).styles({left:e.x+c+"px",top:e.y-25+"px",opacity:0}).text(l).transition().delay(500).style("opacity",1)}function nodeClick(){return function(e){clearLastClick(),d3.selectAll("circle").classed("off",!0),d3.select(this).classed("off",!1),d3.select(this).classed("gold opac_9",!0),lastClicked=d3.select(this),smallLabel(e),d3.select("circle#Dada").classed("off",!1),pathBack(e),d3.select("#route").transition().style("left","0%"),d3.select("#nav").transition().style("left","-120%")}}function pathBack(e){var l;l=1!=e.value.distance&&e.value.hasOwnProperty("distance")?e.value.roots:["Dada"];var t="line."+e.id;d3.selectAll(t).classed("clicked",!0);var c="div#a_"+e.id;d3.select(c).classed("pathBack",!0),l.forEach(function(e){var l="line."+e;d3.selectAll(l).classed("clicked",!0)}),l.forEach(function(t){var c="circle#"+t;d3.select(c).classed("off",!1);var s="line."+e.id+"."+t;if(d3.selectAll(s).classed("clicked",!1).classed("pathBack",!0),e.value.distance>1){var a="line."+t+".Dada";d3.selectAll(a).classed("clicked",!1).classed("pathBack",!0),d3.select("#downArrow").style("height","20em");var i="div#a_"+t;d3.select(i).classed("pathBack current",!0),l.indexOf(t)>0&&d3.select(i).classed("rightSide",!0).style("left","96%"),d3.select("img.back").style("bottom","10em")}else d3.select("img.back").style("bottom","0em");console.log(s)})}function showLines(e,l,t){d3.selectAll(e).styles({"stroke-opacity":l,"stroke-width":1,diplay:"inline"})}function clearNodeClick(){console.log("clear node click"),clearLastClick(),d3.select("#route").transition().style("left","-120%"),d3.select("#nav").transition().style("left","0%")}var lastClicked=null;