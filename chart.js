function draw_bars(data){
  d3.select("#chart").selectAll("svg").remove();
  var width = 1900,
      height = 250;
  var margin = {top: height*0.05, right: width*0.02, bottom: height*0.15, left: width*0.02};

  var formatPercent = d3.format(".0%");

  var x = d3.scaleBand()
      .rangeRound([0, width*0.96])
      .padding(0.1);


  var y = d3.scaleLinear()
      .range([height*0.8, 0]);

  var xAxis = d3.axisBottom(x);

  var yAxis = d3.axisLeft(y)
      .tickFormat(formatPercent);

  var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);


  var g_bars = svg    
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  var g_h = svg
      .append("g");


  var hero_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-10, 0])
    .html(function(d){
      var link = '"dota2heroes/205x115/'+d.h+'.png"';
      var cosa = '<img src='+link+' style="float:left">'+
                 '<span style="color:red;float:left">hero_name</span></p>'+
                 '<span style="color:red;float:left">hero_kills</span></p>'+
                 '<span style="color:red;float:left">hero_deaths</span></p>';
      return cosa;
    });


  var w_tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-1, 0])
    .html(function(d) { 
      return "<strong>Frequency:</strong> <span style='color:red'>" + (d.f*100).toFixed(2) + "%</span></p><strong>Win rate:</strong> <span style='color:red'>" + (d.w*100).toFixed(2)+ "%</span>"; });

  var l_tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-1, 0])
        .html(function(d) { 
          return "<strong>Frequency:</strong> <span style='color:red'>" + (d.f*100).toFixed(2) + "%</span></p><strong>Lose rate:</strong> <span style='color:red'>" + (d.l*100).toFixed(2) + "%</span>"; });

  g_bars.call(w_tool_tip);
  g_bars.call(l_tool_tip);
  g_h.call(hero_tip);

        
  x.domain(data.map(function(d) { return d.h; }));
  y.domain([0, d3.max(data, function(d) { return d.f; })]);

  g_bars.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height*0.8 + ")")
      .call(xAxis);
  g_bars_text = g_bars.selectAll("text")
      .style("opacity", 0);

  g_bars.append("g")
      .attr("class", "y axis")
      .call(yAxis);
      

  g_bars.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "w_bar")
      .attr("x", function(d) { return x(d.h); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.f); })
      .attr("height", function(d) { return height*0.8 - y(d.f*d.w); })
      .on('mouseover', w_tool_tip.show)
      .on('mouseout', w_tool_tip.hide);

  g_bars.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "l_bar")
      .attr("x", function(d) { return x(d.h); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.f-(d.f*d.w)); })
      .attr("height", function(d) { return height*0.8 - y(d.f*d.l); })
      .on('mouseover', l_tool_tip.show)
      .on('mouseout', l_tool_tip.hide)

  g_h.selectAll(".image")
      .data(data)
      .enter().append("image")
      .attr("xlink:href", function(d) { return "dota2heroes/205x115/"+d.h+".png"; })
      .attr("x", function(d) { return x(d.h)+margin.left; })
      .attr("y", (height*0.8)+margin.top+8)
      .attr("width", x.bandwidth())
      .attr("height", x.bandwidth()*0.56)
      .on('mouseover', hero_tip.show)
      .on('mouseout', hero_tip.hide)
      .on("click", function(){
          var foreground = d3.select("#right").selectAll("g.foreground").selectAll("path")
            .style("stroke","steelblue")
            .style("stroke-width", 1);

          selected_path = d3.select("#right").select("g.foreground").select("path.hero_"+this.__data__.h)
            .style("stroke","red")
            .style("stroke-width", 2)

        });

  svg
      .attr("height", height*0.8+margin.top+8+(x.bandwidth()*0.56));

}