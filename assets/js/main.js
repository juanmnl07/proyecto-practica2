(function($){

	//****** GLOBALS ******
	var asociaciones = {"asociaciones":[{}]};
	var globalData = [];
	var colores = [{'hombre':'#2E9AFE'},{'mujer':'#F781F3'}];
	var coloresStroke = [{'hombre':'#0040FF'},{'mujer':'#FF00FF'}];

	//****** END GLOBALS ******

	$(document).ready(function(){
		//evento clic en el label tabla 1
		$("body").on('click', '#represent-value .key', function(){
                        console.log('key click!');
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




					var disallowed = {
						"nombre"   : [ "atr_r", "atr_fill", "atr_stroke" ]
						,"genero"  : [ "atr_r" ]
						,"edad"    : [ "atr_fill", "atr_stroke" ]
						,"salario" : [ "atr_fill", "atr_stroke" ]
					};

					if ( -1 != $.inArray(valSelected, disallowed[keySelected] ) )
						window.alert( "You can't represent " + keySelected + " as " + valSelected );




					var encontrado = false;
					$.each(asociaciones, function(k, v){
						$.each(v, function(k2, v2){
							$.each(v2, function(k3, v3){
								if(valSelected === v3){ //si no se encuentra se almacena en una estructura
									//asociaciones[k].splice(k2, 1);//si se encuentra el valor se elimina para actualzar la asignacion
									asociaciones[k][k2] = {keySelected: valSelected};
								}
							});	
						});
					});

					console.log(asociaciones);
					if (encontrado == false){
						var asociacion = {};
						asociacion[keySelected] = valSelected;
						asociaciones.asociaciones.push(asociacion);//almacenar el nuevo valor en la estructura
					}
					//console.log(asociaciones);
					//incluir el archivo que se encarga de dibujar circulos
					//recorrer la estructura de asociaciones para imprimirlos en pantalla
					//remover graficos
					limpiarCanvas();
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

		//funcion para verificar si existe un elemento en un arreglo
		function findInArray(keys, k){
			var encontrado = false;
		    for (var i = keys.length - 1; i >= 0; i--) {
		    	if(keys[i] == k){
		    		encontrado = true;
		    	}
		    };
		    return encontrado;	
		}

		//funcion para borrar la clase 'selected' en las etiquetas
		function removeSelected(tabla){
			$(tabla + ' div').each(function(index){
				var label = $(this).find('label');
				$(label).removeClass("selected");
			});
		}

		

		function printGraphAndAssociations(){
			var total_x = 0;
			for (var i = 0; i < globalData.length; i++) {
				jsonObject = JSON.parse(globalData[i], function(k, v){
					$.each(asociaciones, function(k2, v2){
						$.each(v2, function(k3, v3){
							$.each(v3, function(k4, v4){
								if(k == k4){
									var atr = v4.replace("atr_","");

									switch(atr){
										case 'r': //radio y la posicion X
											total_x += v;
											setAtr_cx((total_x * 2) + 10);
											setAtr_r(v);
											break;
										case 'fill': //fill
											var color = '';
											$.each(colores, function(k5, v5){
												$.each(v5, function(k6, v6){
													color = v.toLowerCase();
													if(k6 == color){
														setAtr_fill(v6);
													}
												});
											});
											break;
										case 'stroke':
											$.each(coloresStroke, function(k5, v5){
												$.each(v5, function(k6, v6){
													color = v.toLowerCase();
													if(k6 == color){
														setAtr_stroke(v6);
													}
												});
											});
											break;
										case 'label':
											setAtr_label(v);
											setText();
											break;
										default:
									}
								}
							});
						});
					})
				});
				setAtr_id(i);
				drawCircle();
			}
		}
	})
})(jQuery);