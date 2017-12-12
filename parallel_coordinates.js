function display_parallel_coordinates(cars){
	var margin = {top: 30, right: 10, bottom: 10, left: 20},
    width = 650 - margin.left - margin.right,
    height = 530 - margin.top - margin.bottom;

	var x = d3.scalePoint().range([0, width],1),
    	y = {},
    	dragging = {};

	var line = d3.line(),
    	axis = d3.axisLeft(),
    	background,
	    foreground;
    d3.select("#right").selectAll("svg").remove();
	var svg = d3.select("#right").append("svg")
	    .attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	x.domain(dimensions = d3.keys(cars[0]).filter(function(d) {
	return d != "name" && (y[d] = d3.scaleLinear()
	    .domain(d3.extent(cars, function(p) { return +p[d]; }))
	    .range([height, 0]));
	}));
	background = svg.append("g")
	  .attr("class", "background")
	.selectAll("path")
	  .data(cars)
	.enter().append("path")
	  .attr("d", path);

	foreground = svg.append("g")
	  .attr("class", "foreground")
	.selectAll("path")
	  .data(cars)
	.enter().append("path")
	  .attr("class", function(d){ return "hero_"+d.name})
	  .attr("d", path);

	var g = svg.selectAll(".dimension")
	  .data(dimensions)
	.enter().append("g")
	  .attr("class", "dimension")
	  .attr("transform", function(d) { return "translate(" + x(d) + ")"; });
	  /*.call(d3.drag()
	    .subject(function(d) { return {x: x(d)}; })
	    .on("start", function(d) {
	      dragging[d] = x(d);
	      background.attr("visibility", "hidden");
	    })
	    .on("drag", function(d) {
	      dragging[d] = Math.min(width, Math.max(0, d3.event.x));
	      foreground.attr("d", path);
	      dimensions.sort(function(a, b) { return position(a) - position(b); });
	      x.domain(dimensions);
	      g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
	    })
	    .on("end", function(d) {
	      delete dragging[d];
	      transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
	      transition(foreground).attr("d", path);
	      background
	          .attr("d", path)
	        .transition()
	          .delay(500)
	          .duration(0)
	          .attr("visibility", null);
	    }));*/
	g.append("g")
	  .attr("class", "axis")
	  .each(function(d) { d3.select(this).call(axis.scale(y[d])); });
	
	g.append("text")
	  .attr("class", "column_name")
	  .style("text-anchor", "middle")
	  .attr("y", -9)
	  .text(function(d) { 
	  	return d; });
	
	g.append("g")
	  .attr("class", "brush")
	  .each(function(d) {
	    d3.select(this).call(d.brush = d3.brushY()
	      .extent([[-10, 0], [10, height]])
	      .on("start", brushstart)
	      .on("brush", brush)
	      .on("end", brush)
	      )
	  })
	.selectAll("rect")
	  .attr("x", -8)
	  .attr("width", 16);

	function brush() {
	var actives = [];
	  svg.selectAll(".dimension .brush")
	    .filter(function(d) {
	      return d3.brushSelection(this);
	    })
	    .each(function(d) {
	      actives.push({
	        dimension: d,
	        extent: d3.brushSelection(this)
	      });
	    });

	var extents = []

	for (var i = 0; i < actives.length; i++){
	  var active = actives[i];
	  var map = d3.scaleLinear().range(y[active.dimension].domain())
	                            .domain(y[active.dimension].range()); 
	  var tmp = [map(active.extent[1]), map(active.extent[0])];
	  extents.push(tmp);
	}

		foreground.style("display", function(d) {
		  return actives.every(function(p, i) {
		    return extents[i][0] <= d[p.dimension] && d[p.dimension] <= extents[i][1];
		  }) ? null : "none";
		});
	}

	function brushstart() {
	d3.event.sourceEvent.stopPropagation();
	}
	function position(d) {
	var v = dragging[d];
	return v == null ? x(d) : v;
	}

	function transition(g) {
	return g.transition().duration(500);
	}

	function path(d) {
	return line(dimensions.map(function(p) { 
	  return [position(p), y[p](d[p])]; }));
	}
}