var longitud = 15;
var strike = 4;
var pila = [];
var dict = {"F":"FF+([+F-F-F]-[-F+F+F])", "[":"[", "]":"]", "+":"+", "-":"-", "(":"(", ")":")"};
draw_tree(1900,900);


function draw_production(production, start_point, angle, increase){
	var point = start_point;
	for (var i = 0; i < production.length; i++){
		point = draw_piece(production[i], point, angle, increase);
	}
}

function draw_piece(piece, point, angle, increase){
	if (piece[0] == 'F'){
		var extra_1 = longitud * Math.sin(point[2]);
		var extra_2 = longitud * Math.cos(point[2]);
		var line = d3.selectAll("svg")
			.append("line")
			.attr("x1", point[0])
			.attr("y1", point[1])
			.attr("x2", point[0]+extra_1)
			.attr("y2", point[1]-extra_2)
			.attr("stroke-width", point[4])
			.attr("stroke", "black");
		point[0]+=extra_1;
		point[1]-=extra_2;	
	}
	else if (piece[0] == '+'){
		point[2]+=(angle+point[3]);
	}
	else if (piece[0] == '-'){
		point[2]-=(angle-point[3]);
	}
	else if (piece[0] == '['){
		var new_point = point.slice();
		pila.push(new_point);
	}
	else if (piece[0] == ']'){
		var new_point = pila[pila.length-1]
		pila.pop();
		return new_point;
	}
	else if (piece[0] == '('){
		point[4] = point[4]/2;
		point[3] = point[3]*2.5;
	}
	else if (piece[0] == ')'){
		point[4] = point[4]*2;
		point[3] = point[3]/2.5;
	}
	return point; 
}

function new_production(production){
	n_production = "";
	for (var i = 0; i < production.length; i++){
		n_production+=dict[production[i]];
	}
	return n_production;
}

function detail(n, production){
	for (var i = 0; i < n; i++){
		production = new_production(production);
	}
	return production;
}

function draw_tree(x,y){
	var initial_angle = 22.5*(Math.PI/180);
	var final_angle = 45.0*(Math.PI/180);
	var animation_duration = 10;
	var updates_per_second = 3;
	var increase = (final_angle-initial_angle) / (animation_duration*updates_per_second);
	var k = 0;

	var tree = detail(4, "F");
	console.log(tree);
	var t = d3.interval(function(elapsed) {
		d3.select("body").selectAll("svg").remove();
		var svg = d3.select("body")
			.append("svg")
			.attr("height", y)
			.attr("width", x);

		draw_production(tree, [x/2,y,0,0,4], initial_angle, k);
		k+=0.0002;
	  
		if (elapsed > animation_duration*1000) 
			t.stop();
	},1000/updates_per_second);
}
