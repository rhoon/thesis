function clearLastClick(){null!=lastClicked&&lastClicked.classed("gold",!1),d3.select("#downArrow").style("height","10em"),d3.selectAll("circle.off").classed("off",!1),d3.selectAll("line.clicked").classed("clicked",!1),d3.selectAll("line.pathBack").classed("pathBack",!1),d3.selectAll("div.article.pathBack").classed("pathBack",!1),d3.selectAll("div.article.rightSide").classed("rightSide",!1),d3.selectAll("div.smallLabel").remove()}function smallLabel(e){var l=e.value.title.length>20?e.value.title.slice(0,15)+"...":e.value.title,c=25,t=e.x>width/2?15:-120;d3.select("div#chart").append("div").classed("smallLabel card",!0).styles({left:e.x+t+"px",top:e.y-25+"px",opacity:0}).text(l).transition().delay(500).style("opacity",1)}function nodeClick(){return function(e){clearLastClick(),d3.selectAll("circle").classed("off",!0),d3.select(this).classed("off",!1),d3.select(this).classed("gold",!0),lastClicked=d3.select(this),smallLabel(e),d3.select("circle#Dada").classed("off",!1),pathBack(e),d3.select("#route").transition().style("left","0%"),d3.select("#nav").transition().style("left","-120%")}}function pathBack(e){var l;l=1!=e.value.distance&&e.value.hasOwnProperty("distance")?e.value.roots:["Dada"];var c="line."+e.id;d3.selectAll(c).classed("clicked",!0);var t="div#a_"+e.id;d3.select(t).classed("pathBack",!0),l.forEach(function(e){var l="line."+e;d3.selectAll(l).classed("clicked",!0)}),l.forEach(function(c){var t="circle#"+c;d3.select(t).classed("off",!1);var s="line."+e.id+"."+c;if(d3.selectAll(s).classed("clicked",!1).classed("pathBack",!0),e.value.distance>1){var a="line."+c+".Dada";d3.selectAll(a).classed("clicked",!1).classed("pathBack",!0),d3.select("#downArrow").style("height","20em");var d="div#a_"+c;d3.select(d).classed("pathBack",!0),l.indexOf(c)>0&&d3.select(d).classed("rightSide",!0),d3.select("img.back").style("bottom","10em")}else d3.select("img.back").style("bottom","0em");console.log(s)})}function showLines(e,l,c){d3.selectAll(e).styles({"stroke-opacity":l,"stroke-width":1,diplay:"inline"})}function clearNodeClick(){console.log("clear node click"),clearLastClick(),d3.select("#route").transition().style("left","-120%"),d3.select("#nav").transition().style("left","0%")}var lastClicked=null;