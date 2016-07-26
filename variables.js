//etiquieta svg
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("height",200);
svg.setAttribute("width",1000);

//variables atributos
var atr_r = '';
var atr_fill = '';
var atr_label = '';
var atr_stroke = '';
var id = '';

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

function setAtr_id(val){
	id = val;
}

function limpiarCanvas(){
	/*jQuery('#graficos').remove();*/
	jQuery('#graficos').append(svg);
}

function draw(){
	var encontrado = false;
	//manipular el canvas para verificar si ya se han generado los circulos por medio del identificador
	for (var i = 0; i < svg.children.length; i++) {
		if(svg.children[i].id == 'circle-' + id){
			var encontrado = true;
			svg.children[i].setAttribute("r", atr_r);
			svg.children[i].setAttribute("cx", atr_cx);
			svg.children[i].setAttribute("fill", atr_fill);
			svg.children[i].setAttribute("stroke", atr_stroke);
		}
	}
	if(encontrado == false){
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute("cy",100); 
		circle.setAttribute("cx", atr_cx);
		circle.setAttribute('stroke-width',3);
		circle.setAttribute("r", atr_r);
		circle.setAttribute("id", 'circle-' + id);
		circle.setAttribute("fill", atr_fill);
		circle.setAttribute("stroke", atr_stroke);
		svg.appendChild(circle);
	}	
}