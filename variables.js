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
var id = '';
var attributosCirculos = [];

function setAtr_id(val){
	id = val;
}

/*function addProperties() {
	var dynamicCode = '';
	for ( var j=0; j < arguments.length; j++ ) {
		var propName = arguments[j];
		dynamicCode += "var"
		+ " atr_" + propName + "= '';"
		+ "function setAtr_" + propName + "(val) {"
		+ "atr_" + propName + "= val; }"
		;
	}
	return dynamicCode;
}

eval(addProperties('r','fill','label','stroke','cx'));*/

function inicializarAtributosCirculos(circulos){
	attributosCirculos = circulos;
}

function writeFunctions() {
	var dynamicCode = '';
	for ( var j=0; j < arguments.length; j++ ) {
		var propName = arguments[j];
		dynamicCode += "var "
		+ propName + "= '';"
		+ " function set_" + propName + "(val) {"
		+ propName + "= val;}";
	}

	console.log(dynamicCode);

	return dynamicCode;
}

function prepareFunctions(){
	for (var i = 0; i < attributosCirculos.length; i++) {
		eval(writeFunctions(attributosCirculos[i].nombre));
	}
}

function initFunction(){
	prepareFunctions();
	/*var dynamicCode = '';
	for ( var j=0; j < arguments.length; j++ ) {
		var circulo = arguments[j];
		//dynamicCode = "set_" + circulo.nombre + "(" + circulo.valores + ");";
		dynamicCode = "set_" + circulo.nombre + "(test);";
	}
	return dynamicCode;*/
}

function inicializarDatosCirculos()
{
	eval(initFunction());
	/*for (var i = 0; i < attributosCirculos.length; i++) {
		var atributosCirculo = attributosCirculos[i];
		eval(initFunction(atributosCirculo));
	}*/	
}

function limpiarCanvas()
{
	jQuery('#graficos').append(svg);
}

/*function drawCircle()
{
	var circle_encontrado = false;
	//manipular el canvas para verificar si ya se han generado los circulos por medio del identificador
	for (var i = 0; i < svg.children.length; i++) {
		//si es encontrado el identificador dentro de los elementos en el canvas se modifican los atributos
		if(svg.children[i].id == 'circle-' + id){
			var circle_encontrado = true;
			svg.children[i].setAttribute("r", atr_r);
			svg.children[i].setAttribute("cx", atr_cx);
			svg.children[i].setAttribute("fill", atr_fill);
			svg.children[i].setAttribute("stroke", atr_stroke);
		}
	}

	//si no se encuentran se crea un elemento circulo de svg
	if(circle_encontrado == false){
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

function setText()
{
	var text_encontrado = false;
	//manipular el canvas para verificar si ya se han generado los circulos por medio del identificador
	for (var i = 0; i < svg.children.length; i++) {
		if(svg.children[i].id == 'text-' + id){
			var text_encontrado = true;
			svg.children[i].textContent = atr_label;
		}
	}

	if(text_encontrado == false){
		var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
		text.setAttribute("y",100); 
		text.setAttribute("x", atr_cx);
		text.setAttribute('font-family','sans-serif');
		text.setAttribute("font-size", 20);
		text.setAttribute("id", 'text-' + id);
		text.setAttribute("text-achor", 'middle');
		text.setAttribute("fill", 'black');
		text.textContent = atr_label;
		svg.appendChild(text);
	}
}*/