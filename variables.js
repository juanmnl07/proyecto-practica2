//etiquieta svg
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("height",200);
svg.setAttribute("width",1000);

/* Global variables */
//variables atributos
/*
var atr_r = '';
var atr_fill = '';
var atr_label = '';
var atr_stroke = '';
*/

var atributosPersonas = [];
function inicializarAtributosCirculos(personas, cantidadPersonas, funciones){
	atributosPersonas = personas;
	initCanvas();
	initCircles(cantidadPersonas);
	eval(addFunctions(funciones));
	eval(initAttributes(atributosPersonas));
	set_cx();
	set_label();
}

function initCircles(cantidadPersonas){
	for (var i = 1; i <= cantidadPersonas; i++) {
		//******* circulos ******
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute("id", 'circle-' + i);
		circle.setAttribute("class", 'circle');
		circle.setAttribute("cy",100);
		svg.appendChild(circle);

		//******* etiquetas *****
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("y",100); 
		text.setAttribute('font-family','sans-serif');
		text.setAttribute("font-size", 20);
		text.setAttribute("id", 'text-' + i);
		text.setAttribute("class", 'text');
		text.setAttribute("text-achor", 'middle');
		text.setAttribute("fill", 'black');
		svg.appendChild(text);
	}
}

function addFunctions() {
	var dynamicCode = '';
	var object = {};
	for ( var j=0; j < arguments.length; j++ ) {
		var objects = arguments[j];
		for ( var i=0; i < objects.length; i++ ) {
			object = objects[i];
			var propName = object.nombre;
			dynamicCode += "function setAtr_" + propName + "(val) {"
			+ "atr_" + propName + "= val; }"
			;
		}
	}
	return dynamicCode;
}

function initAttributes() {
	var dynamicCode = '';
	var object = {};
	for ( var j=0; j < arguments.length; j++ ) {
		var objects = arguments[j];
		for ( var k=0; k < objects.length; k++ ) {
			object = objects[k];
			for (var i = 0; i < object.atributos.length; i++) {
				var atributos = object.atributos[i];
				atributos = JSON.parse(atributos);
				dynamicCode += "setAtr_" + atributos.atributo + "('" + atributos.valor + "'); "
				+ "svg.children[id='circle-" + object.id + "'].setAttribute('" + atributos.atributo + "', " + 'atr_' + atributos.atributo + "); ";
			}
			/*var propName = object.nombre;
			for (var i = 0; i < object.valores.length; i++) {
				var valorAtributo = object.valores[i];
				console.log(valorAtributo);
				dynamicCode += "setAtr_" + propName + "('" + valorAtributo + "'); "
				+ "for (var i = 0; i < svg.children.length; i++) { "
				+ "if(svg.children[i].id == 'circle-' + (i+1)){ "
				//+ "console.log('circle-' + (i+1)); "
				//+ "console.log(atr_" + propName + "); "
				+ "svg.children[i].setAttribute('" + propName + "', " + 'atr_' + propName + "); "
				+ "} "
				+ "} ";
			}*/
		}		
	}
	return dynamicCode;
}

function initCanvas()
{
	jQuery('#graficos').append(svg);
}

function set_cx(){
	var radio = 0;
	for (var i = 0; i < svg.children.length; i++) {
		if(svg.children[i].getAttribute('class') == 'circle'){
			radio += parseInt(svg.children[i].getAttribute("r"));
			var cx = ((radio * 2) + 10);
			svg.children[i].setAttribute('cx', cx);	
		}
	}
}

function set_label(){
	var label = '';
	for (var i = 0; i < svg.children.length; i++) {
		if(svg.children[i].getAttribute('class') == 'circle'){
			label = svg.children[i].getAttribute('label');
			cx = svg.children[i].getAttribute('cx');
			svg.children[(i+1)].textContent = label;	
			svg.children[(i+1)].setAttribute('x', cx);	
		}
	}
}