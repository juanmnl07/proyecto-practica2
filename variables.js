//etiquieta svg
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("height",200);
svg.setAttribute("width",1000);

//variables atributos
var atr_r = '';
var atr_fill = '';
var atr_label = '';
var atr_stroke = '';

//funciones set para cada atributo
function setAtr_r(val){
	atr_r = val;
}

function setAtr_fill(val){
	atr_fill = val;
}

function setAtr_label(val){
	atr_label = val;
}

function setAtr_stroke(val){
	atr_stroke = val;
}

function setAtr_cx(val){
	atr_cx = val;
}

function limpiarCanvas(){
	jQuery('#graficos svg').remove();
	jQuery('#graficos').append(svg);
}

function draw(){
	var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
	circle.setAttribute("cy",100); 
	circle.setAttribute("cx", atr_cx);
	circle.setAttribute('stroke-width',3);
	circle.setAttribute("color", atr_fill);
	circle.setAttribute("stroke", atr_stroke);
	circle.setAttribute("r", atr_r);
	svg.appendChild(circle);
}

/*function set_data(data_circle){
	for (var i = 0; i < data_circle.length; i++) {
		$.each(data_circle[i], function(k, v){
			circles.setAttribute(k,v);
			if(k == 'fill'){
				var color = '#F5A9F2';
				if(v == 'Hombre'){
					color = 'blue';
				}
				circles.setAttribute(k,color);
			}		
		});
	};
}*/