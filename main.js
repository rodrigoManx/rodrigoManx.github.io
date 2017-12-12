var json_file = "teamfights_all.json";
var diameter_teamfights_vis = 560;
var margin_c_teamfights_vis = 0;
var diameter_chart2_vis = 500;
var chunk_size = 100;
var pack = d3.pack()
    .size([diameter_teamfights_vis - margin_c_teamfights_vis, diameter_teamfights_vis - margin_c_teamfights_vis])
    .padding(6);

var hero_list = [];
var duration_selected,
	intensity_selected,
	same_team = 0,
	visible = 0;
var d_min, d_max, i_min, i_max;

var filter_button = d3.select("#top")
	.append("img")
	.attr("class", "button")
	.attr("src", "filter.png")
	.style("position", "absolute")
	.style("left", "10px")
	.style("top", "10px")
	.style("z-index", 1)
	.attr("width", 100)
    .attr("height", 100)
    .on("click", function() { display_menu(); });


var durations = ["Short", "Medium", "Long", "Extensive", "All"]; 
var intensities = ["Quiet", "Normal", "Exciting", "All"]

var panel = d3.select("body")
	.append("div")
	.attr("class", "filter_stuff")
	.style("position", "absolute")
	.style("background", "white")
	.style("width", "50%")
	.style("height", "80%")
	.style("left", "25%")
	.style("top", "10%")
	.style("opacity", "1")
	.style("z-index", 1);

panel.append("p")
.append("center")
.append("text")
.text("Duration");

panel.append("center")
    .selectAll("labels").data(durations)
	.enter()
	.append("label")
	.text(function(d){return d;})
	.append("input")
    .attr("type", "radio")
    .attr("name", "d")
    .attr("value", function(d){return d;})
    .on("click", function() {duration_selected = this.value;});

panel.append("p")
.append("center")
.append("text")
.text("Intensity");

panel.append("center")
    .selectAll("labels").data(intensities)
	.enter()
	.append("label")
	.text(function(d){return d;})
	.append("input")
    .attr("type", "radio")
    .attr("name", "i")
    .attr("value", function(d){return d;})
    .on("click", function() {intensity_selected = this.value;});

panel.append("p")
.append("center")
.append("text")
.text("Heroes")
.append("p")
.append("text")
.text("Same team")
.append("input")
.attr("type", "checkbox")
.attr("name", "h")
.attr("value", "h")
.on("click", function() {same_team = 1-same_team;})
.append("p")
panel.append("center").append("div")
.style("width", "80%")
.style("height", "50%");

for (var i = 1; i <= 113; i++){
	if(i != 24){
    	panel.selectAll("div")
    		.append("img")
    		.attr("src", "dota2heroes/205x115/"+i+".png")
    		.attr("class", "button")
    		.style("width", "7.5%")
    		.on("click", function(){
    			this.style.opacity = "1";
    			console.log(this.src);
    			console.log(get_number(this.src));
    			hero_list.push(Number(get_number(this.src)))});
	}
}
panel.append("center")
	.append("input")
  	.attr("type", "button")
  	.attr("name", "toggle")
  	.attr("value", "OK")
  	.attr("onclick", "togglePressed()");

function display_menu(){
	if(visible==1)
		d3.select("body").select("div.filter_stuff").style("display", "inline");
	else
		d3.select("body").select("div.filter_stuff").style("display", "none");
	visible=1-visible;
}

function togglePressed(){
	console.log(hero_list);
	if(duration_selected == "Short"){
		d_min = 0;
		d_max = 1800;
	}
	else if(duration_selected == "Medium"){
		d_min = 1800;
		d_max = 2700;	
	}
	else if(duration_selected == "Long"){
		d_min = 2700;
		d_max = 3600;	
	}
	else if(duration_selected == "Extensive"){
		d_min = 3600;
		d_max = 18000;	
	}
	else{
		d_min = 0;
		d_max = 18000;	
	}
	if(intensity_selected == "Quiet"){
		i_min = 1;
		i_max = 13;
	}
	else if(intensity_selected == "Normal"){
		i_min = 14;
		i_max = 26;	
	}
	else if(intensity_selected == "Exciting"){
		i_min = 27;
		i_max = 40;	
	}
	else{
		i_min = 1;
		i_max = 40;	
	}
	d3.select("body").select("div.filter_stuff").style("display", "none");
	d3.json(json_file, function(error, dota2){
		var filtered_list = filter(dota2, d_min, d_max, i_min, i_max, hero_list, same_team);
		draw_charts(diameter_teamfights_vis, margin_c_teamfights_vis, filtered_list, chunk_size);	
	});
}

function get_number(name){
	var subs = name.substring(40);
	var n = "";
	for (var i = 0; i < subs.length; i++){
		if(subs[i]=='.'){
			break;
		}
		else{
			n+=subs[i]
		}
	}
	return n;
}

d3.json(json_file, function(error, dota2){
	var filtered_list = filter(dota2, 0, 18000, 0, 40, hero_list, 1);
	draw_charts(diameter_teamfights_vis, margin_c_teamfights_vis, filtered_list, chunk_size);	
	
});