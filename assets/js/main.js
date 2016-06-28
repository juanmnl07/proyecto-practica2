(function($){

	//GLOBALS
	var asociaciones = {"asociaciones":[{}]};

	$(document).ready(function(){
		//evento clic en el label tabla 1
		$("body").on('click', '#represent-value .key', function(){
			if($(this).hasClass("selected")){
				$(this).removeClass("selected");
			} else {
				removeSelected('#represent-value');//remover selecciones previas
				$(this).addClass("selected");
			}
		});

		//evento clic en el label tabla 2
		$("body").on('click', '#represent-variables .value', function(){
			if($(this).hasClass("selected")){
				$(this).removeClass("selected");
			} else {
				removeSelected('#represent-variables');//remover selecciones previas
				$(this).addClass("selected");

				//validar que se haya seleccionado por lo menos un elemento de la tabla 1
				var keyElementSelected = $("#represent-value .key.selected");
				if(keyElementSelected.length > 0){
					var keySelected = keyElementSelected.text();//guardar el valor key en una variable
					var valSelected = $(this).text();//guardar el valor value en una variable
					//consultar el archivo de las asociaciones y verificar uno por uno si ya existe el par
					//leer la estructura "asociaciones"
					console.log(asociaciones);
					var encontrado = false;
					$.each(asociaciones, function(k, v){
						$.each(v, function(k2, v2){
							$.each(v2, function(k3, v3){
								if((keySelected == k3) && (valSelected == v3)){ //si no se encuentra se almacena en una estructura
									encontrado = true;
								}
							});	
						});
					});

					var asociacion = {};
					if(encontrado == false){
						asociacion[keySelected] = valSelected;
						asociaciones.asociaciones.push(asociacion);//almacenar el nuevo valor en la estructura
					}
					//recorrer la estructura de asociaciones para imprimirlos en pantalla
					printAssociations();
				}
			}
		});
	})

	$.ajax({
		url : '/get-data',
		type : 'GET',
		dataType : 'json',
		success : function(response){
			var data = response.data;
			var keys = [];
			//representar los keys del json dinamicamente, si se extiende los datos del json, este se mostrara en el cuadro
			for (var i = data.length - 1; i >= 0; i--) {
				var key = {};
				jsonObject = JSON.parse(data[i], function(k, v){
					if(findInArray(keys, k) == false){
						var index = keys.length;
						keys.push(key[index] = k);
					}
				})
			}
			//representar los 'keys' en la tabla 1
			for (var i = 0; i < keys.length; i++) {
				if(keys[i] != ""){
					$("#represent-value").append("<div id=\"value-" + i + "\" class=\"values\"><label class=\"key\" for=\"" + keys[i] + "\">" + keys[i].toUpperCase() + "</label>");
				}
			};
		} 
	});

	$.ajax({
		url : '/get-variables',
		type : 'GET',
		dataType : 'json',
		success : function(response){
			var data = response.data;
			for (var i = 0; i < data.length; i++) {
				$.each(data[i], function(k, v) {
				    $("#represent-variables").append("<div id=\"value-" + i + "\" class=\"values\"><label class=\"value\" for=\"" + v + "\">" + v + "</label>");
				});
			};
		}
	});

function findInArray(keys, k){
	var encontrado = false;
    for (var i = keys.length - 1; i >= 0; i--) {
    	if(keys[i] == k){
    		encontrado = true;
    	}
    };
    return encontrado;	
}

function removeSelected(tabla){
	$(tabla + ' div').each(function(index){
		var label = $(this).find('label');
		$(label).removeClass("selected");
	});
}

function printAssociations(){
	//remover todos las selecciones anteriores
	$("#represent-asoc .association").each(function(){
		$(this).remove();
	});
	$.each(asociaciones, function(k, v){
		$.each(v, function(k2, v2){
			$.each(v2, function(k3, v3){
				$("#represent-asoc").append("<div id=\"association-" + k3 + "-" + v3 + "\" class=\"association\"><label class=\"value\" for=\"" + k3 + "\">" + k3 + "</label><span> - </span><label class=\"value\" for=\"" + v3 + "\">" + v3 + "</label></div>");
			});
		});
	});
}

})(jQuery);