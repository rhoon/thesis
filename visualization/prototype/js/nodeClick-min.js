function clearLastClick(){null!=lastClicked&&lastClicked.classed("gold opac_9",!1),d3.selectAll("circle.off").classed("off",!1),d3.selectAll("line.clicked").classed("clicked",!1),d3.selectAll("line.pathBack").classed("pathBack",!1),d3.selectAll("div.smallLabel").remove(),d3.select("#downArrow").style("height","10em"),d3.selectAll("div.article.pathBack").attr("style",null),d3.select("div.article.selected").classed("selected",!1),d3.select("div.article.current").classed("current",!1),d3.selectAll("div.article.pathBack").classed("pathBack",!1),d3.selectAll("div.article.rightSide").classed("rightSide",!1),d3.selectAll("div.article.leftSide").classed("leftSide",!1)}function rClick(){var e=d3.select("div.article.rightSide"),l=d3.select("div.article.current");null!=e._groups[0][0]&&(l.classed("current",!1).transition().ease(d3.easeCubic).style("left","-76%"),l.classed("leftSide",!0),e.classed("rightSide",!1).transition().ease(d3.easeCubic).style("left","10%"),e.classed("current",!0))}function lClick(){var e=d3.select("div.article.leftSide"),l=d3.select("div.article.current");null!=e._groups[0][0]&&(l.classed("current",!1).transition().ease(d3.easeCubic).style("left","96%"),l.classed("rightSide",!0),e.classed("leftSide",!1).transition().ease(d3.easeCubic).style("left","10%"),e.classed("current",!0))}function smallLabel(e){var l=e.value.title.length>20?e.value.title.slice(0,15)+"...":e.value.title,t=25,c=e.x>width/2?15:-120;d3.select("div#chart").append("div").classed("smallLabel card",!0).styles({left:e.x+c+"px",top:e.y-25+"px",opacity:0}).text(l).transition().delay(500).style("opacity",1)}function zoom(e){var l=parseFloat(d3.select("circle#Dada").attr("cx")),t=parseFloat(d3.select("circle#Dada").attr("cy")),c=[Math.abs(l-e.x),Math.abs(t-e.y)],s=(l+e.x)/2;centerY=(t+e.y)/2,d3.select("svg").append("circle").attr("fill","blue").attr("r",4).attr("cx",s).attr("cy",centerY),console.log(l,t),console.log(e.x,e.y),console.log(c),console.log("CENTER"),console.log(s,centerY),console.log(height,width);var a=.3/Math.max(c[0]/width,c[1]/height);translate=[width/2-a*s,height/2-a*centerY],console.log("SCALE, TRANSLATE"),console.log(a),console.log(translate),g=d3.select("g"),g.transition().duration(2e3).style("stroke-width",1.5/a+"px").attr("transform","translate("+translate+")scale("+a+")")}function nodeClick(){return function(e){console.log(e),clearLastClick(),d3.selectAll("circle").classed("off",!0),d3.select(this).classed("off",!1),d3.select(this).classed("gold opac_9",!0),lastClicked=d3.select(this),smallLabel(e),d3.select("circle#Dada").classed("off",!1),pathBack(e),d3.select("#route").transition().styles({left:"0%",opacity:1}),d3.select("#nav").transition().styles({left:"-120%",opacity:0})}}function pathBack(e){var l;l=1!=e.value.distance&&e.value.hasOwnProperty("distance")?e.value.roots:["Dada"];var t="line."+e.id;d3.selectAll(t).classed("clicked",!0);var c="div#a_"+e.id;d3.select(c).classed("pathBack selected",!0),l.forEach(function(e){var l="line."+e;d3.selectAll(l).classed("clicked",!0)}),l.forEach(function(t){var c="circle#"+t;d3.select(c).classed("off",!1);var s="line."+e.id+"."+t;if(d3.selectAll(s).classed("clicked",!1).classed("pathBack",!0),e.value.distance>1){var a="line."+t+".Dada";d3.selectAll(a).classed("clicked",!1).classed("pathBack",!0),d3.select("#downArrow").style("height","20em");var i="div#a_"+t;d3.select(i).classed("pathBack current",!0),l.indexOf(t)>0&&d3.select(i).classed("rightSide",!0).style("left","96%"),d3.select("img.back").style("bottom","10em")}else d3.select("img.back").style("bottom","0em");console.log(s)})}function showLines(e,l,t){d3.selectAll(e).styles({"stroke-opacity":l,"stroke-width":1,diplay:"inline"})}function clearNodeClick(){clearLastClick(),d3.select("#route").transition().styles({left:"-120%",opacity:0}),d3.select("#nav").transition().styles({left:"0%",opacity:1})}var lastClicked=null;