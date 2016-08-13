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
			if($(this).hasClass("active")){
				//remover asociacion
				var valor = $(this).text();
				var variable = obtenerVariable(valor);
				var answer = confirm("¿Realmente deseas remover la asociacion: " + valor + '-' + variable + "?");

				if(answer){
					removerAsociacion(valor);
					//limpiar seleccion
					$('#'+valor).removeClass('active');
					$('#'+variable).removeClass('active');
				}
				limpiarCanvas();
				printGraphAndAssociations();
			} else {
				//agregar clase active
				$(this).addClass("active");
				//remover la ultima seleccion
				removeLastSelection('#represent-value');
				//agregar clase last-selected
				$(this).addClass("last-selected");
			}
		});

		//evento clic en el label tabla 2
		$("body").on('click', '#represent-variables .value', function(){

			if($(this).hasClass("active")){
				$('#messages').append('<div class="alert alert-warning alert-dismissible" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Alerta!</strong> Ya has seleccionado el valor: <strong>' + $(this).text() + '</strong> para la asociacion, por favor selecciona otro valor</div>')
			}else{
				//validar que se haya seleccionado por lo menos un elemento de la tabla 1
				var keyElementSelected = $("#represent-value .key.active.last-selected");
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
					if ( -1 != $.inArray(valSelected, disallowed[keySelected] ) ) {
						$('#messages').append('<div class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>¡Alerta!</strong> No puedes representar '  + keySelected + ' as ' + valSelected + ', por favor selecciona otro valor</div>')
					} else {
						$(this).addClass("active");
						$(this).addClass("disabled");
						$.each(asociaciones, function(k, v){
							$.each(v, function(k2, v2){
								$.each(v2, function(k3, v3){
									if(valSelected === v3){ //si no se encuentra se almacena en una estructura
										asociaciones[k][k2] = {keySelected: valSelected};
									}
								});	
							});
						});
						var asociacion = {};
						asociacion[keySelected] = valSelected;
						asociaciones.asociaciones.push(asociacion);//almacenar el nuevo valor en la estructura

						$('#assoc table tbody').remove();
						$('#assoc table').append('<tbody></tbody>');
						$.each(asociaciones, function(k2, v2){
							$.each(v2, function(k3, v3){
								$.each(v3, function(k4, v4){									
									$('#assoc table tbody').append('<tr><td>' + k4 + '</td><td>' + v4 + '</td></tr>');
								});
							});
						})
						//console.log(asociaciones);
						//incluir el archivo que se encarga de dibujar circulos
						//recorrer la estructura de asociaciones para imprimirlos en pantalla
						//remover graficos
					}
				}
			}
		});

		//genar las opciones de la taba 'valores'		
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
						$("#represent-value").append('<a href="#" class="list-group-item key" id="' + keys[i] + '">' + keys[i] + '</a>');
						
					}
				};
			} 
		});

		//genar las opciones de la taba 'valores
		$.ajax({
			url : '/get-variables',
			type : 'GET',
			dataType : 'json',
			success : function(response){
				var data = response.data;
				for (var i = 0; i < data.length; i++) {
					$.each(data[i], function(k, v) {
					    $("#represent-variables").append('<a href="#" class="list-group-item value" id="' + v + '">' + v + '</a>');
					});
				};
			}
		});

		//dibujar graficos
		$("#dibujar-graficos").on("click", function(event){
			event.preventDefault;
			limpiarCanvas();
			printGraphAndAssociations();
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
		function removeLastSelection(tabla){
			$(tabla + ' a').each(function(){
				$(this).removeClass("last-selected");
			});
		}

		//buscar en las asociaciones una seleccion a eliminar
		function removerAsociacion(valor){
			//buscar en el arreglo de las asociaciones el valor seleccionado
			$.each(asociaciones, function(k, v){
				$.each(v, function(k2, v2){
					$.each(v2, function(k3, v3){
						console.log(k3 + '-' + v3);
						if(valor === k3){ //si no se encuentra se almacena en una estructura
							asociaciones[k].splice(k2, 1);
						}
					});	
				});
			});
		}

		//obtener una variable dentro de las asociaciones por medio de valor
		function obtenerVariable(valor){
			//buscar en el arreglo de las asociaciones el valor seleccionado
			var variable;
			$.each(asociaciones, function(k, v){
				$.each(v, function(k2, v2){
					$.each(v2, function(k3, v3){
						if(valor === k3){ //si no se encuentra se almacena en una estructura
							variable = v3;
						}
					});	
				});
			});
			return variable;
		}

		function printGraphAndAssociations(){
			//remover el tbody de la tabla de selecciones
			var total_x = 0;
			var label = '';
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
											label = v;
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
				if(label != '')
					setText();
			}
		}
	})
})(jQuery);