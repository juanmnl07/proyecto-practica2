(function($){

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
					$("#represent-value").append("<div id=\"value-" + i + "\" class=\"values\"><h3>Valor #" + (i+1) + "</h3><label for=\"" + keys[i] + "\">" + keys[i].toUpperCase() + "</label>");
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
				console.log(data[i].radio);
				if(typeof data[i].radio !== "undefined"){
					$("#represent-variables").append("<div id=\"value-" + i + "\" class=\"values\"><h3>Valor #" + (i+1) + "</h3><label for=\"" + data[i].radio + "\">" + data[i].radio+ "</label>");
				}
				if(typeof data[i].salaryLabel !== "undefined"){
					$("#represent-variables").append("<div id=\"value-" + i + "\" class=\"values\"><h3>Valor #" + (i+1) + "</h3><label for=\"" + data[i].salaryLabel + "\">" + data[i].salaryLabel+ "</label>");
				}
				if(typeof data[i].salarySize !== "undefined"){
					$("#represent-variables").append("<div id=\"value-" + i + "\" class=\"values\"><h3>Valor #" + (i+1) + "</h3><label for=\"" + data[i].salarySize + "\">" + data[i].salarySize+ "</label>");
				}
				if(typeof data[i].ageLabel !== "undefined"){
					$("#represent-variables").append("<div id=\"value-" + i + "\" class=\"values\"><h3>Valor #" + (i+1) + "</h3><label for=\"" + data[i].ageLabel + "\">" + data[i].ageLabel+ "</label>");
				}
				if(typeof data[i].ageSize !== "undefined"){
					$("#represent-variables").append("<div id=\"value-" + i + "\" class=\"values\"><h3>Valor #" + (i+1) + "</h3><label for=\"" + data[i].ageSize + "\">" + data[i].ageSize+ "</label>");
				}
			};
		}
	});

})(jQuery);

function findInArray(keys, k){
	var encontrado = false;
    for (var i = keys.length - 1; i >= 0; i--) {
    	if(keys[i] == k){
    		encontrado = true;
    	}
    };
    return encontrado;	
}