function draw_chart(people){
	people.sort(function(first, second) {
   		return second.frequency - first.frequency;
  	});
	  var total = 0;
	for (var i = 0; i < people.length; i++){
		total+=people[i].frequency		
	}
	for (var i = 0; i < people.length; i++){
		people[i].frequency/=total; 		
	}

	  data = people.slice(0,100);




	  var width = 1900,
	      height = 300;
	  var margin = {top: height*0.05, right: width*0.02, bottom: height*0.25, left: width*0.02};

	  var formatPercent = d3.format(".0%");

	  var x = d3.scaleBand()
	      .rangeRound([0, width*0.96])
	      .padding(0.1);


	  var y = d3.scaleLinear()
	      .range([height*0.7, 0]);

	  var xAxis = d3.axisBottom(x);

	  var yAxis = d3.axisLeft(y)
	      .tickFormat(formatPercent);

	  var svg = d3.select("body")
	      .append("svg")
	      .attr("width", width)
	      .attr("height", height);

      svg.append("text")
      	.append("g")
  		.text("TOP 100");

	  var g_bars = svg    
	      .append("g")
	      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	  /*var hero_tip = d3.tip()
	    .attr("class", "d3-tip")
	    .offset([-10, 0])
	    .html(function(d){
	      var link = '"dota2heroes/205x115/'+d.h+'.png"';
	      var cosa = '<img src='+link+' style="float:left">'+
	                 '<span style="color:red;float:left">hero_name</span></p>'+
	                 '<span style="color:red;float:left">hero_kills</span></p>'+
	                 '<span style="color:red;float:left">hero_deaths</span></p>';
	      return cosa;
	    });*/


	  var w_tool_tip = d3.tip()
	    .attr("class", "d3-tip")
	    .offset([-1, 0])
	    .html(function(d) { 
	      return "<strong>Frequency:</strong> <span style='color:red'>" + (d.frequency*100).toFixed(4) + "%</span>"; });

	  /*var l_tool_tip = d3.tip()
	        .attr("class", "d3-tip")
	        .offset([-1, 0])
	        .html(function(d) { 
	          return "<strong>Frequency:</strong> <span style='color:red'>" + (d.f*100).toFixed(2) + "%</span></p><strong>Lose rate:</strong> <span style='color:red'>" + (d.l*100).toFixed(2) + "%</span>"; });
	  g_bars.call(l_tool_tip);
	  g_h.call(hero_tip);
*/
	  g_bars.call(w_tool_tip);

	        
	x.domain(data.map(function(d) { return d.name;}));
	y.domain([0, d3.max(data, function(d) { return d.frequency;})]);
	


	g_bars.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height*0.7 + ")")
		.call(xAxis);
	g_bars_text = g_bars.selectAll("text")
		.style('text-anchor', 'start')
      .attr("transform", "rotate(45,-10,10)");    


	g_bars.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Frequency");
	

  	g_bars.selectAll(".bar")
      	.data(data)
    	.enter().append("rect")
      	.attr("class", "w_bar")
      	.attr("x", function(d) { return x(d.name); })
      	.attr("width", x.bandwidth())
      	.attr("y", function(d) { return y(d.frequency); })
      	.attr("height", function(d) { return height*0.7 - y(d.frequency); })
      	.on('mouseover', w_tool_tip.show)
      .on('mouseout', w_tool_tip.hide);

}