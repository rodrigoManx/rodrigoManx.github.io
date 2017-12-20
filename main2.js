var json_file_1 = "freq_n1.json";
var json_file_2 = "freq_n2.json";
var json_file_3 = "freq_l1.json";
var json_file_4 = "freq_l2.json";
var json_file_5 = "freq_2.json";
var hero_list = [];
var selectValue,
	text,
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

var panel = d3.select("body")
	.append("div")
	.attr("class", "filter_stuff")
	.style("position", "absolute")
	.style("background", "white")
	.style("width", "50%")
	.style("height", "30%")
	.style("left", "25%")
	.style("top", "35%")
	.style("opacity", "1")
	.style("z-index", 1);

panel
.append("center")
.append("text")
.text("Buscar ");


var opts = ["Nombre completo", "Primer nombre", "Apellido paterno"];

var select = panel.append('center').append('select')
  	.attr('class','select')
    .on('change',onchange)

var options = select
  .selectAll('option')
	.data(opts).enter()
	.append('option')
		.text(function (d) { return d; });

function onchange() {
	selectValue = this.value;
};


panel.append("center")
	.append("input")
    .attr("type","text")
    .attr("size", 20)
    .on("change", function() {
      text = this.value;
    });


panel.append("center")
	.append("p")
	.append("input")
  	.attr("type", "button")
  	.attr("name", "toggle")
  	.attr("value", "OK")
  	.attr("onclick", "togglePressed()");

function togglePressed(){
	panel.selectAll("center.res").remove();

	var total = 0;
	var current = 0;
	if(selectValue == "Nombre completo"){
		d3.json(json_file_5, function(error, people){
			for (var i = 0; i < people.length; i++){
				if (people[i].name == text){
					current = people[i].frequency;
				}
				total+=people[i].frequency;
			}

			panel.append('center')
				.attr("class", "res")
				.append('p')
				.text(current + ' personas se llaman ' + text)
			panel.append('center')
				.attr("class", "res")
				.append('p')
				.text('La frecuencia es: ' + (current/total).toFixed(4))
		});
	}
	else if(selectValue == "Primer nombre"){
		d3.json(json_file_1, function(error, people){
			for (var i = 0; i < people.length; i++){
				if (people[i].name == text){
					current = people[i].frequency;
				}
				total+=people[i].frequency;
			}

			panel.append('center')
				.attr("class", "res")
				.append('p')
				.text(current + ' personas se llaman ' + text)
			panel.append('center')
				.attr("class", "res")
				.append('p')
				.text('La frecuencia es: ' + (current/total).toFixed(4))
		});
	}
	else if(selectValue == "Apellido paterno"){
		d3.json(json_file_3, function(error, people){
			for (var i = 0; i < people.length; i++){
				if (people[i].name == text){
					current = people[i].frequency;
				}
				total+=people[i].frequency;
			}

			panel.append('center')
				.attr("class", "res")
				.append('p')
				.text(current + ' personas se apellidan ' + text)
			panel.append('center')
				.attr("class", "res")
				.append('p')
				.text('La frecuencia es: ' + (current/total).toFixed(4))
		});
	}
}


function display_menu(){
	if(visible==1)
		d3.select("body").select("div.filter_stuff").style("display", "inline");
	else
		d3.select("body").select("div.filter_stuff").style("display", "none");
	visible=1-visible;
}

d3.json(json_file_1, function(error, people){
	draw_chart(people)
});
d3.json(json_file_3, function(error, people){
	draw_chart(people)
});
d3.json(json_file_5, function(error, people){
	draw_chart(people)
});