//import express 和 ws 套件
const express = require('express')
const SocketServer = require('ws').Server
const { prefix } = require('./prefix.json');
//指定開啟的 port
const PORT = 1935

//創建 express 的物件，並綁定及監聽 3000 port ，且設定開啟後在 console 中提示
const server = express()
    .listen(PORT, () => console.log(`Listening on ${PORT}`))

//將 express 交給 SocketServer 開啟 WebSocket 的服務
const wss = new SocketServer({ server })

const re_prefix = new RegExp("^["+prefix+"].*", "gi");
const re_cmd = new RegExp("[^"+prefix+"].*", "gi");
var cmd;
var arg;
//當 WebSocket 從外部連結時執行
wss.on('connection', ws => {
    console.log('Client connected')
	
	ws.on('message', data => {
		var client_data = data.toString();
		if(client_data != undefined) {
			if(re_prefix.test(client_data)) {
				let cmd = client_data.match(re_cmd)[0];
				let arg = cmd.split('|');
				cmd = arg.shift().toLowerCase();
				console.log("cmd:"+cmd+", arg["+arg+"]");
				
				switch(cmd) {
					case "sendtext": {
						//取得所有連接中的 client
						let clients = wss.clients
						//做迴圈，發送訊息至每個 client
						clients.forEach(client => {
							client.send(`${arg[0]} say ${arg[1]}`)
						})
					}break;
				}
			}
			else {
				
			}
			re_prefix.lastIndex = 0;
		}
			
		
	});

	ws.on('close', () => {
		console.log('Close connected')
	});
});

