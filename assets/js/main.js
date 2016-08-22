(function($){

	//****** GLOBALS ******
	var asociaciones = {"asociaciones":[{}]}; //variable global para almacenar las asociaciones
	var globalData = []; //almacenar en una variable global todos los datos de las personas
	var colores = [{'hombre':'#2E9AFE'},{'mujer':'#F781F3'}];
	var coloresStroke = [{'hombre':'#0040FF'},{'mujer':'#FF00FF'}];

	//****** END GLOBALS ******

	$(document).ready(function(){

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

		//genar las opciones de la taba 'variables'
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
						//si se ha seleccionado valor:variable que no es permitida se desplegara un mensaje
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
									$('#assoc table tbody').append('<tr><td>' + k4 + '</td><td>' + v4 + '</td></tr>'); //asignar la asociacion en la tabla correspondiente
								});
							});
						})
					}
				}
			}
		});

		//dibujar graficos
		$("#dibujar-graficos").on("click", function(event){
			event.preventDefault;
			crearDatosCirculos();
			/*limpiarCanvas();
			printGraphAndAssociations();*/
		});

		//funcion para llenar todos los atrributos de los circulos en un array
		function crearDatosCirculos(){
			//recorrer asociaciones
			var funciones = []; //almacenar los datos que le corresponde a los circulos
			$.each(asociaciones, function(key, object){
				$.each(object, function(key, atributo){
					$.each(atributo, function(valor, variable){
						//variable temporal para almacenar los datos de cada atributo
						var funcion = {};
						funcion.nombre = variable.replace('atr_','');

						//agregar los atributos al arreglo de circulos
						funciones.push(funcion);
					})
				})
			});

			var personas = [];
			for (var i = 0; i < globalData.length; i++) {
				var persona = {};
				var atrPersona = [];
				jsonObject = JSON.parse(globalData[i], function(atr, valor){
					$.each(asociaciones, function(k, asociacion){
						$.each(asociacion, function(k2, objeto){
							$.each(objeto, function(k3, variable){
								if(atr == k3){
									if((valor == 'Hombre') || (valor == 'Mujer')){
										valor = obtenerColor(valor.toLowerCase());
									}
									atrPersona.push('{"atributo":"' + variable.replace('atr_', '') + '", "valor":"' + valor + '"}');
								}
							});
						});
					});
				});
				persona.id = (i + 1);
				persona.atributos = atrPersona;
				personas.push(persona);
			}
			inicializarAtributosCirculos(personas, globalData.length, funciones);
		}

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

		//obtener el codigo de color correspondiente al genero
		function obtenerColor(key){
			var valor = '';
			$.each(colores, function(k, obj){
				$.each(obj, function(tipo, cod){
					if(key == tipo){
						valor = cod;
					}
				});
			});
			return valor;
		}

	})
})(jQuery);