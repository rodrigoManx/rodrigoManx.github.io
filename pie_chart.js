function draw_pie_chart(data, diameter_teamfights_vis, margin_c_teamfights_vis, filtered_list, chunk_size){
   	d3.select("#pie_chart").selectAll("svg").remove();
    var diameter = diameter_teamfights_vis;
    var small_circle_diameter = diameter*0.15;
    var radius = diameter / 2;
	var svg_2 = d3.select("#pie_chart")
		.append("svg")
		.attr("class", "pie_chart_2")
		.attr("width", diameter)
		.attr("height", diameter);
		g_results = svg_2.append("g").attr("transform", "translate(" + radius + "," + radius + ")");

	var color = d3.scaleOrdinal(["hsl(120,50%,50%)", "hsl(33,50%,50%)"]);

	var pie = d3.pie()
	    .sort(null)
	    .value(function(d) { return d.s; });

	var path = d3.arc()
	    .outerRadius(radius)
	    .innerRadius(0);

	var label = d3.arc()
	    .outerRadius(radius - 10)
	    .innerRadius(small_circle_diameter);

	var arc = g_results.selectAll("arc")
	    .data(pie(data))
	    .enter().append("g")
	    .attr("class", "arc")
	    .on("click", function(d) { 
	    	filtered_list_tmp = winner_filter(filtered_list, d.data.n);
	    	draw_teamfights(diameter_teamfights_vis, margin_c_teamfights_vis, filtered_list_tmp, chunk_size); 
	    });

    if (data[0]["s"] > 0 && data[1]["s"] > 0){
	    var all_circle = g_results
	    	.append("g")
	    	.attr("class", "all_circle")
		    .append("circle")
		    .style("fill", "rgb(255, 215, 0)")
		    .attr("r",small_circle_diameter)
		    .on("click", function(d) { 
		    	draw_teamfights(diameter_teamfights_vis, margin_c_teamfights_vis, filtered_list, chunk_size); 
		    });

		g_results.append("text")
			.attr("transform", "translate(" + -10 + "," + 0 + ")")
			.text("all");
	}

	arc.append("path")
		.attr("d", path)
		.attr("fill", function(d) { return color(d.data.n); });

	arc.append("text")
		.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
		.attr("dy", "0.35em")
		.text(function(d) { return d.data.s > 0? d.data.n : ""; });

}