var http = require('http');
var fs = require('fs');
var url = require('url');
var lineByLineReader = require('line-by-line');
var lr = new lineByLineReader('data.txt');
var lr2 = new lineByLineReader('variables.js');
var lr3 = new lineByLineReader('asociations.txt');
var dataArr = []; //JSON DATA
var dataArr2 = []; //VARIABLES
//var dataArr3 = []; //ASOCIATIONS
var varPosition = 0; //posicion de la variable en el javascript main.js

	//data json
	lr.on('error', function(err){
		console.log('file does not exist');
	});

	lr.on('line', function(line){
		var jsonPersonas = JSON.parse(line);
		var dataObj = {};
		for (var i = jsonPersonas.personas.length - 1; i >= 0; i--) {
			dataArr.push(dataObj[i] = JSON.stringify(jsonPersonas.personas[i]));
		};
	});

	lr.on('end', function(){
		console.log('********** DATA **********');
		console.log(dataArr);
	});

	//data variables
	lr2.on('error', function(err){
		console.log('file does not exist');
	});

	lr2.on('line', function(line){
		var variable = line.indexOf("var");
		if(variable != -1){ //verificar si en la linea existe la palabra variable
			var atr = line.indexOf("atr_"); //verificar si en la declaracion de la variable existe un prefijo atr_
			if(atr != -1){
				var data = line.split('=');
				var variable = data[0].split(' ');
				var dataObj = {};
				dataObj["var_"+varPosition] = variable[1];
				dataArr2.push(dataObj);
				varPosition++;	
			}			
		}
	});

	lr2.on('end', function(){
		console.log('********** VARIABLES **********');
		console.log(dataArr2);
	});

	//data variables
	/*lr3.on('error', function(err){
		console.log('file does not exist');
	});

	lr3.on('line', function(line){
		var jsonAsociaciones = JSON.parse(line);
		var dataObj = {};
		for (var i = jsonAsociaciones.asociations.length - 1; i >= 0; i--) {
			dataArr3.push(dataObj[i] = JSON.stringify(jsonAsociaciones.asociations[i]));
		};
	});

	lr3.on('end', function(){
		console.log('********** ASOCIATIONS **********');
		console.log(dataArr3);
	});*/

var router = {
	//assets requests
	"/assets/css/style.css" : function(req, res){
		res.writeHead(200, {"Content-Type" : "text/css"});
		res.end(fs.readFileSync('./assets/css/style.css'));
	},
	"/assets/js/main.js" : function(req, res){
		res.writeHead(200, {"Content-Type" : "text/javascript"});
		res.end(fs.readFileSync('./assets/js/main.js'));
	},
	"/assets/js/jquery.js" : function(req, res){
		res.writeHead(200, {"Content-Type" : "text/javascript"});
		res.end(fs.readFileSync('./assets/js/jquery.js'));
	},
	//ajax requests
	"/get-data" : function(req, res){
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.end(JSON.stringify({"data" : dataArr}));
	},
	//ajax requests
	"/get-variables" : function(req, res){
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.end(JSON.stringify({"data" : dataArr2}));
	},
	/*//ajax requests
	"/get-asociations" : function(req, res){
		res.writeHead(200, {"Content-Type": "text/plain"});
		res.end(JSON.stringify({"data" : dataArr3}));
	},*/
	//page requests
	"/" : function(req, res){
		res.writeHead(200, { 'Content-Type': 'text/html' });  
        res.end(fs.readFileSync('index.html', "utf-8"));
	}
};

var server = http.createServer(function(request, response){
	var path = url.parse(request.url).pathname;
	
	if (router[request.url]){
		router[request.url](request, response);
	}
	
});

server.listen(3333, function(){
	console.log("listening to the port 3333");
});	