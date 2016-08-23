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

//array global para almacenar los atributos de cada circulo, esta funcion se ejecuta desde main.js
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

//funcion para inicializar los circulos, contiene atributos preestablecidos
function initCircles(cantidadPersonas){
	for (var i = 1; i <= cantidadPersonas; i++) {
		//******* circulos ******
		var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		circle.setAttribute("id", 'circle-' + i);
		circle.setAttribute("class", 'circle');
		circle.setAttribute("cy",100);
		circle.setAttribute("fill","#fff");
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

//funcion que permite crear las funciones SET de cada atributo de forma dinamica
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

//funcion que se encarga de inicializar cada atributo ejecutando la funcion correspondiente, posteriormente se utliza la variable para asignar el atributo del circulo
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
		}		
	}
	return dynamicCode;
}

//permite inicializar el canvas donde se ubicaran los circulos
function initCanvas()
{
	jQuery('#graficos').append(svg);
}

//asigna la posición sobre el eje x de cada circulo con base en el radio
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

//permite asignar el label a cada circulo
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