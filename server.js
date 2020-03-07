http=require("http")
f=require("fs");
url=require("url");
web_socket=require("ws");

var USER={};var NUM=0;


http_server=http.createServer(function(req,res){
	console.log(req.method+"\t"+req.url);
	URL=url.parse(req.url,true).pathname;
	console.log(URL);
	if(req.url=="/"){
		res.end(f.readFileSync("index.html"));
	};
	if(URL=="/host"){
		res.end(f.readFileSync("server.html"));
	};
	if(URL=="/join"){
		res.end(f.readFileSync("client.html"));
	};
	
	
	

}).listen(8080,function(){console.log("server running at http://127.0.0.1:8080")})

wss=new web_socket.Server({server:http_server})

wss.on("connection",function(ws,req,client){
	console.log("usere joinde a scoket!");
	console.log(req.url)
	URL=url.parse(req.url,true);
	u=URL.query;
	ws.id=u.user
	if(URL.pathname=="/host"){
		USER[ws.id]={ws:ws};	

	}
	else if(URL.pathname=="/join"&& USER[u.to]!=undefined){
		USER[ws.id]={to:u.to,ws:ws};
		USER[u.to].to=ws.id;
		USER[u.to].ws.send("joined!!")

	}else{ws.close()};
	
	//ws.id=u.user
	//USER[ws.id]={to:u.to,ws:ws};



	ws.on("message",function(msg){
		console.log(ws.id+":"+msg);
		//add: user[ws.id].ws.send("msg");
		USER[USER[ws.id].to].ws.send(msg);
	});



	ws.on("close",function(){
		console.log(ws.id+" left the server");
		delete USER[ws.id];




	});
});

/*function onmsg(msg){
	wss.clients.forEach(function(client){

		if (client.readyState === web_socket.OPEN) {
        client.send(msg);

		}	
	});


}*/


