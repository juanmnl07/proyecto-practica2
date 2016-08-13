var http = require('http');
var fs = require('fs');
var url = require('url');
var lineByLineReader = require('line-by-line');
var lr = new lineByLineReader('data.json');
var lr2 = new lineByLineReader('variables.js');
var dataArr = []; //JSON DATA
var dataArr2 = []; //VARIABLES
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

var router = {
	//assets requests
	"/assets/css/bootstrap.css" : function(req, res){
		res.writeHead(200, {"Content-Type" : "text/css"});
		res.end(fs.readFileSync('./assets/css/bootstrap.css'));
	},
	"/assets/js/bootstrap.js" : function(req, res){
		res.writeHead(200, {"Content-Type" : "text/javascript"});
		res.end(fs.readFileSync('./assets/js/bootstrap.js'));
	},
	"/assets/js/main.js" : function(req, res){
		res.writeHead(200, {"Content-Type" : "text/javascript"});
		res.end(fs.readFileSync('./assets/js/main.js'));
	},
	"/variables.js" : function(req, res){
		res.writeHead(200, {"Content-Type" : "text/javascript"});
		res.end(fs.readFileSync('./variables.js'));
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