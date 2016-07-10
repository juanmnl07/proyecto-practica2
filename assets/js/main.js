(function($){

	//****** GLOBALS ******
	var asociaciones = {"asociaciones":[{}]};
	var globalData = [];

	//etiquieta svg
	var svg1 = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg1.setAttribute("height",200);
	svg1.setAttribute("width",1000);
	//****** END GLOBALS ******

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
					//incluir el archivo que se encarga de dibujar circulos
					//recorrer la estructura de asociaciones para imprimirlos en pantalla
					//remover graficos
					removeCircles();
					printGraphAndAssociations();
				}
			}
		});

		$.ajax({
			url : '/get-data',
			type : 'GET',
			dataType : 'json',
			success : function(response){
				var data = response.data;
				globalData = data;
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
						$("#represent-value").append("<div id=\"value-" + i + "\" class=\"values\"><label class=\"key\" for=\"" + keys[i] + "\">" + keys[i] + "</label>");
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

		function removeCircles(){
			$('#graficos svg').remove();
		}

		function printGraphAndAssociations(){
			$('#graficos').append(svg1);
			var total_x = 0;
			for (var i = 0; i < globalData.length; i++) {
				var arrayObjeto = [];
				jsonObject = JSON.parse(globalData[i], function(k, v){
					$.each(asociaciones, function(k2, v2){
						$.each(v2, function(k3, v3){
							$.each(v3, function(k4, v4){
								var values = {};
								if(k == k4){
									var atr = v4.replace("atr_","");
									values[atr] = v;
									if(atr == 'r'){
										total_x += v;
										values['cx'] = (total_x * 2) + 10;
									}
									arrayObjeto.push(values);
								}
							});
						});
					})
				});
				set_data(arrayObjeto);
			}
		}

		//Inicializar las variables globales
		function set_data(data_circle){
			var circles = document.createElementNS("http://www.w3.org/2000/svg", "circle");
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
					circles.setAttribute("cy",100); 
					circles.setAttribute('stroke-width',3);

				});
			};
			svg1.appendChild(circles);
		}
	})
})(jQuery);