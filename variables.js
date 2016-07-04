(function($){
	var atr_r = '';
	var atr_fill = '';
	var atr_label = '';
	var atr_stroke = '';
	var circle = '<circle ';
	var label = '<text dx="40" dy="55">';

$(document).ready(function(){
	//Inicializar las variables globales
	function set_data(data_circle){
		$.each(data_circle, function(k, v){
			//incluir atributos
			circle += k + '="' + v + '"';
			if(k == 'label'){
				label += v + '</text>';//label
			}
		});
		circle += ' />'; 
	}
	//Devolver el grafico
	function get_data(){
		return circle + label;
	}
});

})(jQuery);