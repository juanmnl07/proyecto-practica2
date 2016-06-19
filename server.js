var http = require('http');
var fs = require('fs');
var url = require('url');
var lineByLineReader = require('line-by-line');
var lr = new lineByLineReader('data.txt');
var dataArr = [];

lr.on('error', function(err){
		console.log('file does not exist');
	});

	lr.on('line', function(line){
		var data = line.split(',');
		var dataObj = {};
		
		for (var i = 0; i < data.length; i++) {
			var dataVal = data[i].split(':');
			dataObj[dataVal[0]] = dataVal[1];
		}


		dataArr.push(dataObj);

		
	});

	lr.on('end', function(){
		console.log(dataArr);
	});

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