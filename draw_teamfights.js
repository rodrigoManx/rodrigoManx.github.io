function draw_teamfights(side, margin_c, filtered_list, chunk_size){
  var lower_bound = 0;
  var page = 1;
  var re = /tf[\d]+/;
  var re1 = /Game [\d]+/;
  var dota2_data = {"name":"Dota 2"};
  var hero_list = [];
  var total_pages = Math.round(filtered_list.length/chunk_size); 

  if (filtered_list.length < chunk_size)
    total_pages = 1;
  dota2_data["children"] = filtered_list.slice(lower_bound,lower_bound+chunk_size);
  var root = d3.hierarchy(dota2_data)
    .sum(function(d) { return d.name.match(re)? d.size: d.size*0.1;})
    .sort(function(a, b) { return b.value - a.value; });

  var focus = root, nodes = pack(root).descendants(), view;

  var selected_games = [];
  
  
  d3.select("#pie_chart").selectAll("svg.explorer").remove();
  d3.select("#pie_chart").selectAll("input").remove();
  d3.select("#pie_chart").selectAll("text.page_label").remove();
  
  var svg_circles = d3.select("#pie_chart")
    .append("svg")
    .style("position", "relative")
    .style("z-index", 0)
    .attr("class", "explorer")
    .attr("width", side)
    .attr("height", side);

  svg_circles.append("image")
    .attr("xlink:href", "analysis.png")
    .attr("class", "button")
    .attr("transform", "translate("+(side-(side*0.15)).toString()+",0)")
    .attr("width", side* 0.15)
    .attr("height", side *0.15)
    .on("click", function() { analyze_games(); });
  
  var g_teamfights = svg_circles
    .append("g")
    .attr("transform", "translate(" + side / 2 + "," + side / 2 + ")");
  

  var div_height = d3.select("#pie_chart").node().getBoundingClientRect().height,
      div_width = d3.select("#pie_chart").node().getBoundingClientRect().width;

  d3.select("#pie_chart")
    .append("text")
    .attr("class", "page_label")
    .style("position", "absolute")
    .style("left", (div_width-50)+"px")
    .style("top", (div_height-37)+"px")
    .style("z-index", 1)
    .style("font-size", "20px")
    .text("/"+total_pages.toString());

  d3.select("#pie_chart")
    .append("input")
    .attr("type","text")
    .attr("size", 1)
    .style("position", "absolute")
    .style("left", (div_width-130)+"px")
    .style("top", (div_height-40)+"px")
    .style("z-index", 1)
    .attr("value",page.toString())
    .on("change", function() {
      g_teamfights.selectAll("circle").remove()
      g_teamfights.selectAll("text").remove()
      page = Number(this.value);
      lower_bound = (this.value-1)*chunk_size;
      dota2_data["children"] = filtered_list.slice(lower_bound,lower_bound+chunk_size);
      root = d3.hierarchy(dota2_data)
          .sum(function(d) { return d.name.match(re)? d.size: d.size*0.1;})
          .sort(function(a, b) { return b.value - a.value; });
      focus = root;
      nodes = pack(root).descendants();
      draw_games(g_teamfights);
    })
  
  svg_circles
    .on("click", function() { c_zoom(root); });

  svg_circles.append("image")
      .attr("xlink:href", "l_arrow.png")
      .attr("class", "button")
      .attr("transform", "translate(0,"+((side/2)-((side*0.15)/2)).toString()+")")
      .attr("width", side* 0.15)
      .attr("height", side *0.15)
      .on("click", function() { update_teamfights(-1);});

  svg_circles.append("image")
      .attr("xlink:href", "r_arrow.png")
      .attr("class", "button")
      .attr("transform", "translate("+(side-(side*0.15)).toString()+","+((side/2)-((side*0.15)/2)).toString()+")")
      .attr("width", side* 0.15)
      .attr("height", side *0.15)
      .on("click", function() { update_teamfights(1);});

  var radiant_color = d3.scaleLinear()
      .domain([-1, 5])
      .range(["hsl(120,25%,50%)", "hsl(120,100%,50%)"])
      //.interpolate(d3.interpolateHcl);

  var dire_color = d3.scaleLinear()
      .domain([-1, 5])
      .range(["hsl(33,25%,50%)", "hsl(33,100%,50%)"])
      //.interpolate(d3.interpolateHcl);

  var tf_color = d3.scaleLinear()
      .domain([0, 15])
      .range(["hsl(0, 100%, 100%)", "hsl(0, 100%, 50%)"])

  var text = g_teamfights.selectAll("text.label");
  var circle = g_teamfights.selectAll("circle");
  var node = g_teamfights.selectAll("circle,text.label");

  draw_games(g_teamfights);

  function draw_games(g_teamfights){
    circle = g_teamfights.selectAll("circle.teamfights")
    .data(nodes)
    .enter().append("circle")
    .attr("class", function(d) { return d.parent ? !d.children ? d.data.deaths ? "node node--tf" : "node node--leaf" : "node" : "node node--root"; })
    .style("fill", function(d) {
     var name = d.data.name;
     if (name.match(re)){
        return tf_color(d.data.deaths);
     }
     else if (name == "Dota 2"){
        return "rgb(255, 215, 0)";
     }
     else if (name.match(re1) && d.data.winner == "radiant"){
        return radiant_color(d.depth);
     }
     else if (name.match(re1) && d.data.winner == "dire"){
        return dire_color(d.depth);
     }
     else if (name == "resumen" && d.parent.data.winner == "radiant"){
        return radiant_color(d.depth);
     }
     else if (name == "resumen" && d.parent.data.winner == "dire"){
        return dire_color(d.depth);
     }
     else {
        return "white";
     }
    })
    .on("click", function(d) { if (focus !== d) c_zoom(d), d3.event.stopPropagation(); });

      g_teamfights.selectAll("text.label")
      .data(nodes)
      .enter()
      .append('text')
      .attr("class", "label")
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .append("tspan")
      .attr("x", 0)
      .attr("y", -20)
      .text(function(d) { 
          return  d.data.name.match(re1)? "": d.data.name; });
      
      g_teamfights.selectAll("text.label")
      .append("tspan")
      .attr("x", 0)
      .attr("y", 0)
      .text(function(d) { 
          return !d.data.name.match(re1)? d.data.name != "resumen"? " deaths: "+ d.data.deaths : " duration: "+ ((d.parent.data.duration)/60).toFixed(2)+"m" : ""; });
      g_teamfights.selectAll("text.label")
      .append("tspan")
      .attr("x", 0)
      .attr("y", 20)
      .text(function(d) { 
          return !d.data.name.match(re1)? d.data.name != "resumen"? " duration: "+ d.data.size+"s" : " FB time: "+ ((d.data.fbt)/60).toFixed(2)+"m" : ""; });

      node = g_teamfights.selectAll("circle,text.label");
      c_zoomTo([root.x, root.y, root.r * 2 + margin_c]);
  }

  function update_teamfights(direction){
    lower_bound+=(chunk_size*direction);
    if (lower_bound < 0 || lower_bound > filtered_list.length){
      lower_bound-=(chunk_size*direction);
    }
    else{
      g_teamfights.selectAll("circle").remove()
      g_teamfights.selectAll("text").remove()
      page+=direction;
      dota2_data["children"] = filtered_list.slice(lower_bound,lower_bound+chunk_size);

      root = d3.hierarchy(dota2_data)
          .sum(function(d) { return d.name.match(re)? d.size: d.size*0.1;})
          .sort(function(a, b) { return b.value - a.value; });

      focus = root;
      nodes = pack(root).descendants();
      
      var minimap = d3.selectAll("input")
       .property("value", page.toString());
       
      draw_games(g_teamfights);
    }
  }

  function analyze_games(){
    var bars_chart = d3.select("#chart");
    bars_chart.select("svg").remove();
    var pie_chart = d3.select("#pie_chart");
    pie_chart.selectAll("svg").remove();
    pie_chart.selectAll("input").remove();
    pie_chart.selectAll("text").remove();
    draw_charts(diameter_teamfights_vis, margin_c_teamfights_vis, selected_games, chunk_size);
    var close_button_svg = d3.select("#pie_chart")
      .select("svg.pie_chart_2")
      .append("image")
      .attr("xlink:href", "close.png")
      .attr("class", "button")
      .attr("transform", "translate(0,0)")
      .attr("width", side* 0.15)
      .attr("height", side *0.15);
  }


  function c_zoom(d) {
    if (d3.event.ctrlKey){
      selected_games.push(d.data);
      
    }
    else{
      var focus0 = focus; 
      focus = d;

      var transition = d3.transition()
          .duration(d3.event.altKey ? 7500 : 750)
          .tween("c_zoom", function(d) {
            var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin_c]);
            return function(t) { c_zoomTo(i(t)); };
          });

      transition.selectAll("text.label")
          .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
          .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
          .on("start", function(d) { if (d.parent === focus) {this.style.display = "inline";}})
          .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
    }
  }

  function c_zoomTo(v) {
    var k = side / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }

}