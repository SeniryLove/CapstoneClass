var https = require('https');
var path = require('path');
var fs = require('fs');
const SocketServer = require('ws').Server;
const PORT = 1935;
const config = {
        key: fs.readFileSync('/etc/letsencrypt/live/coturn.koreacentral.cloudapp.azure.com/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/coturn.koreacentral.cloudapp.azure.com/cert.pem')
};

var server = https.createServer(config).listen(PORT,() => console.log(`Listening on ${PORT}`))
const wss = new SocketServer({ server: server });
var roomConfig = {};


function initRoomConfig(room){
	if(roomConfig[room] == undefined)
	{
		roomConfig[room] = {};
		roomConfig[room].userCount = 0;
		roomConfig[room].User = [];
		roomConfig[room].Host = "";
		roomConfig[room].Client = [];
	}
}

function addRoomUser(room,user,userName)
{
	roomConfig[room].userCount = roomConfig[room].userCount + 1;
	var conf = {userID:`${user}`, userName:userName};
	roomConfig[room].User.push(conf);
	if(roomConfig[room].userCount == 1)
	{
		roomConfig[room].Host = user;
		return "Host";
	}
	else
	{
		roomConfig[room].Client.push(user);
		return "Client";
	}
}

function removeRoomUser(room,user)
{
	roomConfig[room].userCount=roomConfig[room].userCount - 1;
	roomConfig[room].User.splice(roomConfig[room].User.findIndex((userName)=>userName.userID==user),1);
	if(user == roomConfig[room].Host)
	{
		return true;
	}
	else
	{
		roomConfig[room].Client.splice(roomConfig[room].Client.findIndex((userID)=>userID==user),1);
	}
	if(roomConfig[room].userCount <= 0)
	{
		delete roomConfig[room];
	}
	return false;
}

wss.on('connection', ws => {
	console.log('Client connected')
	ws.on('message', message => {
	var client_data = JSON.parse(message);
		if(client_data != undefined) {
			console.log(client_data);
			switch(client_data.cmd)
			{
				case "SendMessage":{
					let clients = wss.clients;
					clients.forEach(client => {
						client.send(JSON.stringify({cmd: "receiveMessage", args:[client_data.args[2],`${client_data.args[0]}：${client_data.args[1]}`]}));
					});
				}break;
				
				case "ConnectRoom":{
					let clients = wss.clients;
					var room = client_data.args[0];
					var userID = client_data.args[1];
					var userName = client_data.args[2];
					if(room != '')
					{
						var isExist = false;
						initRoomConfig(room);
						roomConfig[room].User.forEach(user => {
							if(user.userName == userName)
							{
								isExist = true;
							}
						})
						if(isExist)
						{
							var usertype = '';
							ws.send(JSON.stringify({cmd: 'ConnectRoom',value: false,args:[userID,usertype]}));
							console.log(roomConfig);
						}
						else
						{
							var usertype = addRoomUser(room,userID,userName);
							ws.send(JSON.stringify({cmd: 'ConnectRoom',value: true,args:[userID,usertype]}));
							
							console.log(roomConfig);
						}
					}
				}break;
				case "LeaveRoom":{
					var clients = wss.clients;
					var room = client_data.args[0];
					var userID = client_data.args[1];
					var userName = roomConfig[room].User.find((user)=> user.userID == userID);
					console.log(userName);
					var hostleaved = removeRoomUser(room,userID);
					if(hostleaved)
					{
						if(!client_data.args[2])
						{
							clients.forEach(client => {
								client.send(JSON.stringify({cmd: 'HostLeaved'}));
							});
						}
					}
					else
					{
						if(!client_data.args[2])
						{
							clients.forEach(client => {
								client.send(JSON.stringify({cmd: 'ClientLeaved', args: [userName.userName]}));
							});
						}
					}
					roomConfig[room].User.splice(roomConfig[room].User.findIndex((user)=> user.userID == userID),1);
				}break;
			}
		}


	});

	ws.on('close', () => {
		console.log('Close connected')
	});
});
