(function($){
	$(document).ready(function(){
		var dataObject = JSON.parse(simularDatos());
		for (var i = dataObject.data.length - 1; i >= 0; i--) {
			var typeCircle = dataObject.data[i].Circle;
			var edad = dataObject.data[i].Edad;
			var nombre = dataObject.data[i].Nombre;
			var genero = dataObject.data[i].Genero;

			var color = 'red';
			if(genero == 'Masculino'){
				color = 'blue';
			}

			$('circle#'+typeCircle).attr("r", edad);
			$('circle#'+typeCircle).attr("fill", color);
			$('text#'+typeCircle+'-label').text(nombre);
		}		

	});
})(jQuery);

function simularDatos(){
    return '{"data":[{"Circle":"first","Nombre":"Carlos","Edad":50,"Genero":"Masculino"},{"Circle":"second","Nombre":"Jose","Edad":23,"Genero":"Masculino"},{"Circle":"third","Nombre":"María","Edad":45,"Genero":"Femenino"}]}';
}